import { prisma } from '@orc/prisma';
import { updateClusterScore } from '@orc/web/lib/score';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getResourceCostType } from '@orc/cloud';

const communicationPayloadSchema = z.object({
  clusterName: z.string().min(1, 'Cluster name is required'),
  clusterId: z.string().min(1, 'Cluster ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

const ownerSchema = z
  .object({
    apiVersion: z.string().optional(),
    kind: z.string().optional(),
    name: z.string().optional(),
    uid: z.string().optional(),
  })
  .nullable()
  .optional();

const orphanedResourceSchema = z.object({
  kind: z.string().min(1, 'Resource kind is required'),
  name: z.string().min(1, 'Resource name is required'),
  namespace: z.string().optional(),
  uid: z.string().min(1, 'Resource UID is required'),
  age: z.string().optional(),
  owner: ownerSchema,
  spec: z.unknown().optional(),
  reason: z.string().min(1, 'Reason is required'),
  labels: z.record(z.string()).optional(),
  annotations: z.record(z.string()).optional(),
});

const summarySchema = z.object({
  totalScanned: z.number().int().nonnegative(),
  totalOrphaned: z.number().int().nonnegative(),
  totalSkipped: z.number().int().nonnegative(),
  totalErrors: z.number().int().nonnegative(),
  scanDuration: z.number().int().nonnegative(),
});

const reportSchema = z.object({
  timestamp: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
  orphanedResources: z.array(orphanedResourceSchema),
  summary: summarySchema,
});

export async function POST(request: Request) {
  try {
    // Verify token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.CLUSTER_COMMUNICATION_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const parsedPayload = communicationPayloadSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json({ error: 'Unauthorized', details: parsedPayload.error.errors }, { status: 401 });
    }

    const cluster = await prisma.cluster.findUnique({
      where: {
        id: parsedPayload.data.clusterId,
        userId: parsedPayload.data.userId,
      },
    });

    if (!cluster) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse and validate report
    const requestBody = await request.json();
    const parsedReport = reportSchema.safeParse(requestBody);

    if (!parsedReport.success) {
      return NextResponse.json({ error: 'Invalid request data', details: parsedReport.error.errors }, { status: 400 });
    }

    // Update cluster last seen
    await prisma.cluster.update({
      where: { id: cluster.id },
      data: {
        lastSeen: new Date(),
        status: 'ACTIVE',
      },
    });

    const resourcesWithCosts = parsedReport.data.orphanedResources.map((resource) => {
      const costType = getResourceCostType(resource.kind, resource.spec);

      return {
        ...resource,
        costType: costType,
      };
    });

    // Create new snapshot with orphaned resources
    await prisma.$transaction(async (tx) => {
      const snapshot = await tx.snapshot.create({
        data: {
          clusterId: cluster.id,
          createdBy: 'agent',
          orphanedResources: {
            create: resourcesWithCosts.map((resource) => ({
              kind: resource.kind,
              name: resource.name,
              namespace: resource.namespace,
              uid: resource.uid,
              age: resource.age ? new Date(resource.age) : null,
              costType: resource.costType,
              reason: resource.reason,
              owner: resource.owner?.name,
              spec: resource.spec ? JSON.stringify(resource.spec) : null,
              status: 'PENDING',
            })),
          },
        },
      });

      return snapshot;
    });

    await updateClusterScore(cluster.id, parsedReport.data.summary);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process orphaned resources report:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
