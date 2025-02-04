import { Injectable, Logger } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';

@Injectable()
export class NamespaceScanner extends BaseResourceScanner<k8s.V1Namespace> {
  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1Namespace[]> {
    try {
      const response = await this.kubeService.coreApi.listNamespace();
      return response.items.map((namespace) => enrichKubernetesObject(namespace, 'Namespace'));
    } catch (error) {
      this.logger.error(`Failed to scan namespaces: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(namespace: k8s.V1Namespace): Promise<{ isOrphaned: boolean; reason?: string }> {
    if (this.isSystemNamespace(namespace.metadata.name)) {
      return { isOrphaned: false };
    }

    try {
      const resources = await this.checkNamespaceResources(namespace.metadata.name);
      const isEmpty = Object.values(resources).every((count) => count === 0);

      return {
        isOrphaned: isEmpty,
        reason: isEmpty
          ? `Empty namespace with no resources (${Object.entries(resources)
              .map(([type]) => type)
              .join(', ')})`
          : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to check namespace ${namespace.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  private async checkNamespaceResources(namespaceName: string) {
    const [pods, services, deployments, secrets] = await Promise.all([
      this.kubeService.coreApi.listNamespacedPod({ namespace: namespaceName }),
      this.kubeService.coreApi.listNamespacedService({ namespace: namespaceName }),
      this.kubeService.appsApi.listNamespacedDeployment({ namespace: namespaceName }),
      this.kubeService.coreApi.listNamespacedSecret({ namespace: namespaceName }),
    ]);

    return {
      pods: pods.items.length,
      services: services.items.length,
      deployments: deployments.items.length,
      secrets: secrets.items.length,
    };
  }

  private isSystemNamespace(name: string): boolean {
    const systemNamespaces = ['default', 'kube-system', 'kube-public', 'kube-node-lease'];
    return systemNamespaces.includes(name);
  }

  async cleanup(namespace: k8s.V1Namespace): Promise<CleanupResult<k8s.V1Namespace>> {
    try {
      await this.kubeService.coreApi.deleteNamespace({ name: namespace.metadata.name });
      return { resource: namespace, success: true };
    } catch (error) {
      return { resource: namespace, success: false, error: error.message };
    }
  }
}
