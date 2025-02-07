import { prisma } from '@orc/prisma';
import { updateClusterScore } from '@orc/web/lib/score';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getResourceCostType } from '@orc/cloud';
import { authenticateRequest, CommunicationPayload } from '@orc/web/lib/api/auth';

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
    const parsedReport = reportSchema.safeParse(requestBody);
    if (!parsedReport.success) {
      return NextResponse.json({ error: 'Invalid request data', details: parsedReport.error.errors }, { status: 400 });
    }

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

    await prisma.$transaction(async (tx) => {
      await tx.snapshot.create({
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
    });

    await updateClusterScore(cluster.id, parsedReport.data.summary);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error('Failed to process orphaned resources report:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
