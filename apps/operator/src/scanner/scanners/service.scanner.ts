import { Injectable, Logger } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';
import { KubeService } from '../../kube/kube.service';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class ServiceScanner extends BaseResourceScanner<k8s.V1Service> {
  constructor(private readonly kubeCache: KubeCache, private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1Service[]> {
    try {
      const response = await this.kubeCache.getAllServices();
      return response.map((svc) => enrichKubernetesObject(svc, 'Service'));
    } catch (error) {
      this.logger.error(`Failed to scan services: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(svc: k8s.V1Service): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      const endpoints = await this.kubeCache.getNamespacedEndpoints({ namespace: svc.metadata.namespace, name: svc.metadata.name });
      const hasNoEndpoints = endpoints.length === 0 || endpoints.every((ep) => !ep.subsets);

      return {
        isOrphaned: hasNoEndpoints,
        reason: hasNoEndpoints ? 'Service has no active endpoints/pods' : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to check service ${svc.metadata.namespace}/${svc.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(svc: k8s.V1Service): Promise<CleanupResult<k8s.V1Service>> {
    try {
      await this.kubeService.coreApi.deleteNamespacedService({
        name: svc.metadata.name,
        namespace: svc.metadata.namespace,
      });
      return { resource: svc, success: true };
    } catch (error) {
      return { resource: svc, success: false, error: error.message };
    }
  }
}
