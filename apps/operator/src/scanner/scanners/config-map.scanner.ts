import * as k8s from '@kubernetes/client-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { KubeService } from '../../kube/kube.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';
import { BaseResourceScanner } from '../base.scanner';

@Injectable()
export class ConfigMapScanner extends BaseResourceScanner<k8s.V1ConfigMap> {
  private usedConfigMaps: Set<string>;

  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async preScan(): Promise<void> {
    const podList = await this.kubeService.coreApi.listPodForAllNamespaces();
    this.usedConfigMaps = new Set<string>();

    podList.items.forEach((pod) => {
      // Get volumes configMap names
      pod.spec?.volumes?.forEach((volume) => {
        if (volume.configMap?.name) {
          this.usedConfigMaps.add(volume.configMap.name);
        }
        if (volume.projected?.sources) {
          volume.projected.sources.forEach((source) => {
            if (source.configMap?.name) {
              this.usedConfigMaps.add(source.configMap.name);
            }
          });
        }
      });

      // Get env configMap names
      pod.spec?.containers.forEach((container) => {
        container.env?.forEach((env) => {
          if (env.valueFrom?.configMapKeyRef?.name) {
            this.usedConfigMaps.add(env.valueFrom.configMapKeyRef.name);
          }
        });
        container.envFrom?.forEach((envFrom) => {
          if (envFrom.configMapRef?.name) {
            this.usedConfigMaps.add(envFrom.configMapRef.name);
          }
        });
      });
    });
  }

  async scan(): Promise<k8s.V1ConfigMap[]> {
    try {
      const response = await this.kubeService.coreApi.listConfigMapForAllNamespaces();
      return response.items.map((cm) => enrichKubernetesObject(cm, 'ConfigMap') as k8s.V1ConfigMap);
    } catch (error) {
      this.logger.error(`Failed to scan ConfigMap: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(cm: k8s.V1ConfigMap): Promise<{ isOrphaned: boolean; reason?: string }> {
    const isUsed = this.usedConfigMaps.has(cm.metadata.name);
    return {
      isOrphaned: !isUsed,
      reason: !isUsed ? 'The ConfigMap is not used by any pod' : undefined,
    };
  }

  async cleanup(cm: k8s.V1ConfigMap): Promise<CleanupResult<k8s.V1ConfigMap>> {
    try {
      await this.kubeService.coreApi.deleteNamespacedConfigMap({name: cm.metadata.name, namespace: cm.metadata.namespace});

      return {
        resource: cm,
        success: true,
      };
    } catch (error) {
      return {
        resource: cm,
        success: false,
        error: error.message,
      };
    }
  }
}
