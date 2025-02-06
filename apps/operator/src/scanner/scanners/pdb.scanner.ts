import { Injectable, Logger } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject, getLabelSelector } from '../../utils/kube';
import { KubeService } from '../../kube/kube.service';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class PdbScanner extends BaseResourceScanner<k8s.V1PodDisruptionBudget> {
  constructor(private readonly kubeCache: KubeCache, private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1PodDisruptionBudget[]> {
    try {
      const response = await this.kubeCache.getAllPDBs();
      return response.map((pdb) => enrichKubernetesObject(pdb, 'PodDisruptionBudget'));
    } catch (error) {
      this.logger.error(`Failed to scan PDBs: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(pdb: k8s.V1PodDisruptionBudget): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      if (!pdb.spec?.selector?.matchLabels) {
        const pods = await this.kubeCache.getNamespacedPods({ namespace: pdb.metadata.namespace });

        return {
          isOrphaned: pods.length === 0,
          reason: pods.length === 0 ? 'No pods found in namespace without label selector' : undefined,
        };
      }

      const labelSelector = getLabelSelector(pdb.spec.selector.matchLabels);
      const params = { namespace: pdb.metadata.namespace, labelSelector };

      const [pods, deployments, statefulsets] = await Promise.all([
        this.kubeCache.getNamespacedPods(params),
        this.kubeCache.getNamespacedDeployments(params),
        this.kubeCache.getNamespacedStatefulSets(params),
      ]);

      const hasNoTargets = !pods.length && !deployments.length && !statefulsets.length;

      return {
        isOrphaned: hasNoTargets,
        reason: hasNoTargets ? `No matching resources found for labels: ${JSON.stringify(pdb.spec.selector.matchLabels)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to check PDB ${pdb.metadata.namespace}/${pdb.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(pdb: k8s.V1PodDisruptionBudget): Promise<CleanupResult<k8s.V1PodDisruptionBudget>> {
    try {
      await this.kubeService.policyApi.deleteNamespacedPodDisruptionBudget({
        name: pdb.metadata.name,
        namespace: pdb.metadata.namespace,
      });
      return { resource: pdb, success: true };
    } catch (error) {
      return { resource: pdb, success: false, error: error.message };
    }
  }
}
