import { getNodeCost } from "./resources-costs/node-cost";
import { getPvcCost } from "./resources-costs/pvc-cost";
import { getSvcCost } from "./resources-costs/svc-cost";

export const getResourceCost = async (resource: OrphanedResource<any>): Promise<number | undefined> => {
    switch (resource.kind) {
        case 'PersistentVolume':
            return getPvcCost(resource);
        case 'Node':
            return getNodeCost(resource);
        case 'Service':
            return getSvcCost(resource);
        default:
            return undefined;
    }
}