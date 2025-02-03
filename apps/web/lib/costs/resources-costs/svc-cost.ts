import { getAwsLoadBalancerPrice } from "@orc/costs";

export const getSvcCost = async (svc: OrphanedResource<ServiceSpec>): Promise<number> => {
    if (svc.spec?.type == "LoadBalancer") {
        return getAwsLoadBalancerPrice();
    }

    return 0;
}