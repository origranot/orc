import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';
import { KubeService } from '../../kube/kube.service';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class PersistentVolumeScanner extends BaseResourceScanner<k8s.V1PersistentVolume> {
  constructor(private readonly kubeCache: KubeCache, private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1PersistentVolume[]> {
    try {
      const response = await this.kubeCache.getPersistentVolumes();
      return response.map((pv) => enrichKubernetesObject(pv, 'PersistentVolume') as k8s.V1PersistentVolume);
    } catch (error) {
      this.logger.error(`Failed to scan PersistentVolume: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(pv: k8s.V1PersistentVolume): Promise<{ isOrphaned: boolean; reason?: string }> {
    const isNotBound = pv.status?.phase !== 'Bound';
    return {
      isOrphaned: isNotBound,
      reason: isNotBound ? 'The PersistentVolume is not bound' : undefined,
    };
  }

  async cleanup(pv: k8s.V1PersistentVolume): Promise<CleanupResult<k8s.V1PersistentVolume>> {
    try {
      await this.kubeService.coreApi.deletePersistentVolume({
        name: pv.metadata.name,
      });

      return {
        resource: pv,
        success: true,
      };
    } catch (error) {
      return {
        resource: pv,
        success: false,
        error: error.message,
      };
    }
  }
}
