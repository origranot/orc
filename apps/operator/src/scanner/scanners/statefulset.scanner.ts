import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';
import { KubeService } from '../../kube/kube.service';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class StatefulSetScanner extends BaseResourceScanner<k8s.V1StatefulSet> {
  constructor(private readonly kubeService: KubeService, private readonly kubeCache: KubeCache, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1StatefulSet[]> {
    try {
      const response = await this.kubeCache.getAllStatefulSets();
      return response.map((statefulSet) => enrichKubernetesObject(statefulSet, 'StatefulSet'));
    } catch (error) {
      this.logger.error(`Failed to scan statefulsets: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(statefulSet: k8s.V1StatefulSet): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      const replicas = statefulSet.spec?.replicas;

      if (replicas === 0) {
        return {
          isOrphaned: true,
          reason: 'StatefulSet is scaled to 0 replicas',
        };
      }

      return {
        isOrphaned: false,
      };
    } catch (error) {
      this.logger.error(`Failed to check statefulset ${statefulSet.metadata?.namespace}/${statefulSet.metadata?.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(statefulSet: k8s.V1StatefulSet): Promise<CleanupResult<k8s.V1StatefulSet>> {
    try {
      await this.kubeService.appsApi.deleteNamespacedStatefulSet({
        name: statefulSet.metadata.name,
        namespace: statefulSet.metadata.namespace,
      });

      return {
        resource: statefulSet,
        success: true,
      };
    } catch (error) {
      return {
        resource: statefulSet,
        success: false,
        error: error.message,
      };
    }
  }
}
