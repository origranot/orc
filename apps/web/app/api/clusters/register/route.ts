import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { redisClient } from '@orc/redis';
import { prisma } from '@orc/prisma';
import { z } from 'zod';

const registrationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  clusterInfo: z.object({
    version: z.string().min(1, 'Cluster version is required'),
    nodes: z.number().int().min(1, 'Cluster must have at least one node'),
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
      return NextResponse.json({ error: 'Invalid request data', details: parsedData.error.errors }, { status: 400 });
    }

    const { token: registrationToken, clusterInfo } = parsedData.data;

    const secret = new TextEncoder().encode(process.env.CLUSTER_REGISTRATION_SECRET);
    const { payload } = await jwtVerify(registrationToken, secret);

    const parsedPayload = payloadSchema.safeParse(payload);
    if (!parsedPayload.success) {
      return NextResponse.json({ error: 'Malformed payload', details: parsedPayload.error.errors }, { status: 400 });
    }

    // Check if registration token is still valid in Redis
    const clusterName = await redisClient.get(`pending_registration:${parsedPayload.data.registrationId}`);
    if (!clusterName) {
      return NextResponse.json({ error: 'Token expired or invalid' }, { status: 401 });
    }

    const cluster = await prisma.cluster.create({
      data: {
        user: { connect: { id: parsedPayload.data.userId } },
        name: parsedPayload.data.clusterName,
        version: clusterInfo.version,
        nodes: clusterInfo.nodes,
        registrationId: parsedPayload.data.registrationId,
        lastSeen: new Date(),
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
      },
    });
  } catch (error) {
    console.error('Failed to register cluster:', error);
    return NextResponse.json({ error: 'Failed to register cluster' }, { status: 500 });
  }
}
