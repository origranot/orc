import { z } from 'zod';

export const communicationPayloadSchema = z.object({
  clusterName: z.string().min(1, 'Cluster name is required'),
  clusterId: z.string().min(1, 'Cluster ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});
