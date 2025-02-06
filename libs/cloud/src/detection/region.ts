import { V1Node } from '@kubernetes/client-node';

export function detectRegionFromNode(node: V1Node): string | undefined {
  const labels = node.metadata?.labels;
  if (!labels) return undefined;

  return labels['topology.kubernetes.io/region'] || labels['failure-domain.beta.kubernetes.io/region'];
}
