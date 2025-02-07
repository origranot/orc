import { prisma } from '@orc/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, CommunicationPayload } from '@orc/web/lib/api/auth';

const dataSchema = z.object({
  version: z.string(),
  nodesCount: z.number(),
});

export async function POST(request: Request) {
  try {
    const payload: CommunicationPayload = await authenticateRequest(request);

    const cluster = await prisma.cluster.findUnique({
      where: {
        id: payload.clusterId,
        userId: payload.userId,
      },
    });

    if (!cluster) {
      return new Response('Unauthorized', { status: 401 });
    }

    const requestBody = await request.json();
    const parsedData = dataSchema.safeParse(requestBody);
    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid request data', details: parsedData.error.errors }, { status: 400 });
    }

    await prisma.cluster.update({
      where: { id: cluster.id, userId: cluster.userId },
      data: {
        version: parsedData.data.version,
        nodes: parsedData.data.nodesCount,
        lastSeen: new Date(),
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Failed to update cluster data:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
