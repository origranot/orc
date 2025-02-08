import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';
import { KubeService } from '../../kube/kube.service';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class PodScanner extends BaseResourceScanner<k8s.V1Pod> {
  constructor(private readonly kubeService: KubeService, private readonly kubeCache: KubeCache, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1Pod[]> {
    try {
      const pods = await this.kubeCache.getAllPods();
      return pods.map((pod) => enrichKubernetesObject(pod, 'Pod'));
    } catch (error) {
      this.logger.error(`Failed to scan pods: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(pod: k8s.V1Pod): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      if (pod.status?.phase === 'Failed' && pod.status?.reason === 'Evicted') {
        return {
          isOrphaned: true,
          reason: 'Pod is evicted',
        };
      }

      if (pod.status?.containerStatuses) {
        const inCrashLoop = pod.status.containerStatuses.some((cs) => cs.state?.waiting?.reason === 'CrashLoopBackOff');
        if (inCrashLoop) {
          return {
            isOrphaned: true,
            reason: 'Pod is currently in CrashLoopBackOff state',
          };
        }
      }

      return { isOrphaned: false };
    } catch (error) {
      this.logger.error(`Failed to check pod ${pod.metadata.namespace}/${pod.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(pod: k8s.V1Pod): Promise<CleanupResult<k8s.V1Pod>> {
    try {
      await this.kubeService.coreApi.deleteNamespacedPod({
        name: pod.metadata.name,
        namespace: pod.metadata.namespace,
      });

      return {
        resource: pod,
        success: true,
      };
    } catch (error) {
      return {
        resource: pod,
        success: false,
        error: error.message,
      };
    }
  }
}
