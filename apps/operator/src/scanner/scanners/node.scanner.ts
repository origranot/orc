import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { enrichKubernetesObject } from '../../utils/kube';

interface NodeDetails {
  nodeName: string;
  totalPods: number;
  daemonSets: Set<string>;
}

@Injectable()
export class NodeScanner extends BaseResourceScanner<k8s.V1Node> {
  private allPodsinCluster: Map<string ,k8s.V1Pod>;
  private allNodesinCluster: k8s.V1NodeList;
  private nodeDetailsMap = new Map<string, NodeDetails>();

  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }
  
  async preScan(): Promise<void> {
      const pods = await this.kubeService.coreApi.listPodForAllNamespaces();
      this.allPodsinCluster = new Map(pods.items.map((pod) => [pod.metadata!.name!, pod]));
  }

  async scan(): Promise<k8s.V1Node[]> {
    try {
      const response = (await this.kubeService.coreApi.listNode());
      const nodes = response.items;
      nodes.map((node) => enrichKubernetesObject(node, 'Node'))
        .forEach((node) => {
        this.nodeDetailsMap.set(node.metadata!.name!, {
          nodeName: node.metadata!.name!,
          totalPods: 0,
          daemonSets: new Set<string>(),
        })
      })
      console.log(nodes)
      return nodes; 
    } catch (error) {
      this.logger.error(`Failed to scan Node: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(node: k8s.V1Node): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      const pods = this.allPodsinCluster;
      const nodeName = node.metadata!.name!;
      const nodeDetails = this.nodeDetailsMap.get(nodeName);

      pods.forEach((pod) => {
        if (nodeName && this.nodeDetailsMap.has(nodeName)) {
          if (pod.spec.nodeName === nodeName) {
            nodeDetails!.totalPods++;
          }
          const ownerReferences = pod.metadata?.ownerReferences;
          ownerReferences!.forEach((ref) => {
            if (ref.kind === "DaemonSet") {
              nodeDetails!.daemonSets.add(ref.name!);
            }
          })
        }
      })
      if (this.nodeDetailsMap.get(node.metadata!.name!)?.totalPods === 0) {
        return {
          isOrphaned: true,
          reason: "Node is not running any workloads",
        };
      }
      const hasOnlyDaemonSets = nodeDetails.totalPods > 0 && nodeDetails.totalPods === nodeDetails.daemonSets.size;
      console.log(hasOnlyDaemonSets);
      return {
        isOrphaned: hasOnlyDaemonSets,
        reason: "Nodes are not running any workloads besides DaemonSets",
      };
    } catch (error) { 
      console.log(error);
    }
  }
}