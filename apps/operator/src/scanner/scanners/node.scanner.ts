import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { enrichKubernetesObject } from '../../utils/kube';

@Injectable()
export class NodeScanner extends BaseResourceScanner<k8s.V1Node> {
  private usedNodes = new Map<string, Boolean>();

  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }
  
  async preScan(): Promise<void> {
      const pods = await this.kubeService.coreApi.listPodForAllNamespaces();
      pods.items.forEach((pod) => {
        const nodeName = pod.spec?.nodeName;
        const ownerReferences = pod.metadata?.ownerReferences;
        ownerReferences?.forEach((ref) => {
          if (ref.kind !== "DaemonSet") {
            this.usedNodes.set(nodeName!, true);
          }
        })
      })
  }

  async scan(): Promise<k8s.V1Node[]> {
    try {
      return (await this.kubeService.coreApi.listNode()).items
      .map((node) => enrichKubernetesObject(node, 'Node') as k8s.V1Node); 
    } catch (error) {
      this.logger.error(`Failed to scan Node: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(node: k8s.V1Node): Promise<{ isOrphaned: boolean; reason?: string }> {
    return {
      isOrphaned: !this.usedNodes.has(node.metadata.name!),
      reason: 'Node is not used by any workloads, except DaemonSets',
    };
  }
}