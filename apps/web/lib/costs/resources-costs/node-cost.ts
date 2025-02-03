import {getAwsNodePrice} from 'cost-calculator';

export const getNodeCost = (node: OrphanedResource<null>): Promise<number | undefined> => {
    return getAwsNodePrice();
}