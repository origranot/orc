import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '../../config/config.service';
import { enrichKubernetesObject } from '../../utils/kube';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class NodeScanner extends BaseResourceScanner<k8s.V1Node> {
  private usedNodes = new Map<string, Boolean>();

  constructor(private readonly kubeCache: KubeCache, config: ConfigService) {
    super(config);
  }

  async preScan(): Promise<void> {
    this.usedNodes.clear();
    const pods = await this.kubeCache.getAllPods();
    pods.forEach((pod) => {
      const nodeName = pod.spec?.nodeName;
      const ownerReferences = pod.metadata?.ownerReferences;
      ownerReferences?.forEach((ref) => {
        if (ref.kind !== 'DaemonSet') {
          this.usedNodes.set(nodeName!, true);
        }
      });
    });
  }

  async scan(): Promise<k8s.V1Node[]> {
    try {
      const nodes = await this.kubeCache.getNodes();
      return nodes.map((node) => enrichKubernetesObject(node, 'Node') as k8s.V1Node);
    } catch (error) {
      this.logger.error(`Failed to scan Node: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(node: k8s.V1Node): Promise<{ isOrphaned: boolean; reason?: string }> {
    if (this.usedNodes.has(node.metadata.name)) {
      return { isOrphaned: false };
    }

    return {
      isOrphaned: true,
      reason: 'Node is not used by any workloads, except DaemonSets',
    };
  }
}
