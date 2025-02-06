import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';
import { KubeService } from '../../kube/kube.service';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class IngressScanner extends BaseResourceScanner<k8s.V1Ingress> {
  constructor(private readonly kubeService: KubeService, private readonly kubeCache: KubeCache, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1Ingress[]> {
    try {
      const response = await this.kubeCache.getAllIngresses();
      return response.map((ingress) => enrichKubernetesObject(ingress, 'Ingress'));
    } catch (error) {
      this.logger.error(`Failed to scan ingresses: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(ingress: k8s.V1Ingress): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      const loadBalancerIngress = ingress.status?.loadBalancer?.ingress;

      if (!loadBalancerIngress || loadBalancerIngress.length === 0) {
        return {
          isOrphaned: true,
          reason: 'Missing load balancer configuration',
        };
      }

      const hasValidIngress = loadBalancerIngress.some((ing) => ing.hostname || ing.ip);

      return {
        isOrphaned: !hasValidIngress,
        reason: !hasValidIngress ? 'Load balancer has no valid IP or hostname' : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to check ingress ${ingress.metadata.namespace}/${ingress.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(ingress: k8s.V1Ingress): Promise<CleanupResult<k8s.V1Ingress>> {
    try {
      await this.kubeService.networkingApi.deleteNamespacedIngress({
        name: ingress.metadata.name,
        namespace: ingress.metadata.namespace,
      });

      return {
        resource: ingress,
        success: true,
      };
    } catch (error) {
      return {
        resource: ingress,
        success: false,
        error: error.message,
      };
    }
  }
}
