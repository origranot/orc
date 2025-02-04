'use server';

import { prisma } from '@orc/prisma';
import { jwtVerify } from 'jose';

export async function checkClusterRegistration(registrationToken: string) {
  const secret = new TextEncoder().encode(process.env.CLUSTER_REGISTRATION_SECRET);
  const { payload } = await jwtVerify(registrationToken, secret);

  const cluster = await prisma.cluster.findFirst({
    where: {
      userId: payload.userId as string,
      registrationId: payload.registrationId as string,
    },
  });

  return {
    registered: !!cluster,
    cluster: cluster
      ? {
          id: cluster.id,
          name: cluster.name,
          status: cluster.status,
        }
      : null,
  };
}
