import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';
import { KubeService } from '../../kube/kube.service';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class DeploymentScanner extends BaseResourceScanner<k8s.V1Deployment> {
  constructor(private readonly kubeService: KubeService, private readonly kubeCache: KubeCache, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1Deployment[]> {
    try {
      const response = await this.kubeCache.getAllDeployments();
      return response.map((deployment) => enrichKubernetesObject(deployment, 'Deployment'));
    } catch (error) {
      this.logger.error(`Failed to scan deployments: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(deployment: k8s.V1Deployment): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      const replicas = deployment.spec?.replicas;

      if (replicas === 0) {
        return {
          isOrphaned: true,
          reason: 'Deployment is scaled to 0 replicas',
        };
      }

      return {
        isOrphaned: false,
      };
    } catch (error) {
      this.logger.error(`Failed to check deployment ${deployment.metadata?.namespace}/${deployment.metadata?.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(deployment: k8s.V1Deployment): Promise<CleanupResult<k8s.V1Deployment>> {
    try {
      await this.kubeService.appsApi.deleteNamespacedDeployment({
        name: deployment.metadata.name,
        namespace: deployment.metadata.namespace,
      });

      return {
        resource: deployment,
        success: true,
      };
    } catch (error) {
      return {
        resource: deployment,
        success: false,
        error: error.message,
      };
    }
  }
}
