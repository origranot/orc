import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { redisClient } from '@orc/redis';
import { prisma } from '@orc/prisma';
import { z } from 'zod';
import { V1Node } from '@kubernetes/client-node';
import { extractProviderDetailsFromNode } from '@orc/cloud';

const nodeSpecSchema = z.object({
  spec: z
    .object({
      providerID: z.string().optional(),
    })
    .optional(),
  metadata: z
    .object({
      labels: z.record(z.string()).optional(),
    })
    .optional(),
});

const registrationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  clusterInfo: z.object({
    version: z.string().min(1, 'Cluster version is required'),
    nodes: z.array(nodeSpecSchema).min(1, 'At least one node is required'),
  }),
});

const payloadSchema = z.object({
  clusterName: z.string().min(1, 'Cluster name is required'),
  registrationId: z.string().min(1, 'Registration ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = registrationSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid request data', details: parsedData.error }, { status: 400 });
    }

    const { token: registrationToken, clusterInfo } = parsedData.data;

    const secret = new TextEncoder().encode(process.env.CLUSTER_REGISTRATION_SECRET);
    const { payload } = await jwtVerify(registrationToken, secret);

    const parsedPayload = payloadSchema.safeParse(payload);
    if (!parsedPayload.success) {
      return NextResponse.json({ error: 'Unauthorized', details: parsedPayload.error.errors }, { status: 401 });
    }

    const clusterName = await redisClient.get(`pending_registration:${parsedPayload.data.registrationId}`);
    if (!clusterName) {
      return NextResponse.json({ error: 'Token expired or invalid' }, { status: 401 });
    }

    const { provider, region } = extractProviderDetailsFromNode(clusterInfo.nodes[0] as V1Node);

    // Create cluster with provider information
    const cluster = await prisma.cluster.create({
      data: {
        user: { connect: { id: parsedPayload.data.userId } },
        name: parsedPayload.data.clusterName,
        version: clusterInfo.version,
        nodes: clusterInfo.nodes.length,
        registrationId: parsedPayload.data.registrationId,
        lastSeen: new Date(),
        provider,
        region,
      },
    });

    const permSecret = new TextEncoder().encode(process.env.CLUSTER_COMMUNICATION_SECRET);
    const permanentToken = await new SignJWT({
      clusterName: cluster.name,
      clusterId: cluster.id,
      userId: parsedPayload.data.userId,
      type: 'cluster',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(permSecret);

    await prisma.cluster.update({
      where: { id: cluster.id },
      data: { token: permanentToken },
    });

    await redisClient.del(`pending_registration:${parsedPayload.data.registrationId}`);

    return NextResponse.json({
      token: permanentToken,
      cluster: {
        id: cluster.id,
        name: cluster.name,
        provider,
        region,
      },
    });
  } catch (error) {
    console.error('Failed to register cluster:', error);
    return NextResponse.json({ error: 'Failed to register cluster' }, { status: 500 });
  }
}
