import { prisma } from '@orc/prisma';

export const updateClusterScore = async (clusterId: string, scanSummary: ScanStatistics) => {
  const score = 100 - (scanSummary.totalOrphaned * 100) / scanSummary.totalScanned;

  await prisma.cluster.update({
    where: { id: clusterId },
    data: { score },
  });
};
