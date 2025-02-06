import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';
import { KubeCache } from '../../kube/cache/kube-cache.service';
import { KubeService } from '../../kube/kube.service';

const IS_DEFAULT_STORAGE_CLASS_ANNOTATION = 'storageclass.kubernetes.io/is-default-class';

@Injectable()
export class StorageClassScanner extends BaseResourceScanner<k8s.V1StorageClass> {
  private usedStorageClasses: Set<string>;

  constructor(private readonly kubeCache: KubeCache, private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async preScan(): Promise<void> {
    const pvs = await this.kubeCache.getPersistentVolumes();
    this.usedStorageClasses = new Set(pvs.map((pv) => pv.spec?.storageClassName));
  }

  async scan(): Promise<k8s.V1StorageClass[]> {
    try {
      const response = await this.kubeCache.getStorageClasses();
      return response.map((sc) => enrichKubernetesObject(sc, 'StorageClass') as k8s.V1StorageClass);
    } catch (error) {
      this.logger.error(`Failed to scan StorageClasses: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(sc: k8s.V1StorageClass): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      const isDefault = sc.metadata.annotations?.[IS_DEFAULT_STORAGE_CLASS_ANNOTATION] === 'true';
      const isUsed = this.usedStorageClasses.has(sc.metadata.name);

      return {
        isOrphaned: !(isDefault || isUsed),
        reason: !(isDefault || isUsed) ? `Storage class is not default and has no persistent volumes using it` : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to check StorageClass ${sc.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(sc: k8s.V1StorageClass): Promise<CleanupResult<k8s.V1StorageClass>> {
    try {
      await this.kubeService.storageApi.deleteStorageClass({
        name: sc.metadata.name,
      });
      return { resource: sc, success: true };
    } catch (error) {
      return { resource: sc, success: false, error: error.message };
    }
  }
}
