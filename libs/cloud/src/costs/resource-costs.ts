import { ResourceCostType } from '@prisma/client';

interface ResourceCostInfo {
  costType: ResourceCostType | 'CONDITIONAL';
}

const RESOURCE_COSTS: Record<string, ResourceCostInfo> = {
  PersistentVolume: {
    costType: 'DIRECT',
  },
  Service: {
    costType: 'CONDITIONAL',
  },
  Ingress: {
    costType: 'CONDITIONAL',
  },
  Node: {
    costType: 'DIRECT',
  },
  Pod: {
    costType: 'INDIRECT',
  },
};

export function getResourceCostType(kind: string, spec?: any): ResourceCostType {
  const resourceInfo = RESOURCE_COSTS[kind];
  if (!resourceInfo) {
    return 'NONE';
  }

  if (resourceInfo.costType === 'CONDITIONAL') {
    if (kind === 'Service' && spec?.type === 'LoadBalancer') {
      return 'DIRECT';
    }

    return 'NONE';
  }

  return resourceInfo.costType;
}
