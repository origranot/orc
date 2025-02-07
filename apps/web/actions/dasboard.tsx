'use server';

import { prisma } from '@orc/prisma';
import { getCurrentUser } from '@orc/web/lib/session';

export async function getDashboardData() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const clusters = await prisma.cluster.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        lastSeen: true,
        score: true,
        snapshots: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            createdAt: true,
            orphanedResources: {
              where: {
                status: 'PENDING',
              },
              select: {
                id: true,
                kind: true,
                namespace: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Handle empty state
    if (!clusters.length) {
      return {
        success: true,
        data: {
          stats: {
            totalClusters: 0,
            totalOrphanedResources: 0,
            clustersWithOrphanedResources: 0,
            averageHealthScore: 0,
          },
          orphanedResourcesByCluster: [],
          topClustersWithOrphanedResources: [],
        },
      };
    }

    // Transform the data
    const transformedClusters = clusters.map((cluster) => ({
      ...cluster,
      lastSnapshot: cluster.snapshots[0] || null,
      orphanedResourcesCount: cluster.snapshots[0]?.orphanedResources.length || 0,
      orphanedResources: cluster.snapshots[0]?.orphanedResources || [],
      snapshots: undefined, // Remove the original snapshots array
    }));

    // Calculate stats
    const totalOrphanedResources = transformedClusters.reduce((sum, cluster) => sum + cluster.orphanedResourcesCount, 0);

    // Sort clusters by orphaned resources count
    const sortedClusters = [...transformedClusters].sort((a, b) => b.orphanedResourcesCount - a.orphanedResourcesCount);

    // Calculate average health score
    const clustersWithScore = clusters.filter((cluster) => cluster.score !== null && cluster.score !== undefined);
    const averageHealthScore =
      clustersWithScore.length > 0 ? clustersWithScore.reduce((sum, cluster) => sum + cluster.score!, 0) / clustersWithScore.length : null;

    const data = {
      stats: {
        totalClusters: clusters.length,
        totalOrphanedResources,
        clustersWithOrphanedResources: transformedClusters.filter((cluster) => cluster.orphanedResourcesCount > 0).length,
        averageHealthScore: averageHealthScore,
      },
      orphanedResourcesByCluster: transformedClusters.map((cluster) => ({
        clusterName: cluster.name,
        orphanedResources: cluster.orphanedResourcesCount,
        lastSnapshotAt: cluster.lastSnapshot?.createdAt,
      })),
      topClustersWithOrphanedResources: sortedClusters.slice(0, 5).map((cluster) => ({
        id: cluster.id,
        name: cluster.name,
        provider: cluster.provider,
        orphanedResources: cluster.orphanedResourcesCount,
        lastSeen: cluster.lastSeen,
        lastSnapshotAt: cluster.lastSnapshot?.createdAt,
        resources: cluster.orphanedResources.reduce((acc, resource) => {
          const key = resource.namespace ? `${resource.kind}/${resource.namespace}` : resource.kind;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      })),
    };

    return { success: true, data };
  } catch (error) {
    console.error('Dashboard data error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
    };
  }
}
