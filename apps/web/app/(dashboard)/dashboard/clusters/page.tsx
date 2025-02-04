'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardHeader } from '@orc/web/components/dashboard/header';
import { DashboardShell } from '@orc/web/components/dashboard/shell';
import { columns } from './columns';
import { DataTable } from '@orc/web/components/data-table/data-table';
import type { Cluster, OrphanedResource, Snapshot } from '@prisma/client';
import { DataTableSkeleton } from '@orc/web/components/shared/advanced-skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getClusters } from '@orc/web/actions/cluster';
import { ClusterConnectModal } from '@orc/web/components/modals/cluster-connect-modal';

export type GetAllClustersResponse = Cluster & {
  lastSnapshot: Snapshot;
  orphanedResources: OrphanedResource[];
  orphanedResourcesCount: number;
};
interface ClusterQueryResult {
  data: GetAllClustersResponse[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export default function ClustersPage() {
  const queryClient = useQueryClient();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const GET_ALL_CLUSTERS_QUERY_KEY = 'clusters';

  const { data: initialData } = useQuery<ClusterQueryResult>({
    queryKey: [GET_ALL_CLUSTERS_QUERY_KEY, 'initial'],
    queryFn: async () => {
      const response = await getClusters({ page: 1, limit: 10 });
      if (!response.success) {
        throw new Error('Failed to fetch clusters');
      }

      return {
        data: response.clusters as GetAllClustersResponse[],
        pagination: response.pagination!,
      };
    },
  });

  const fetchClusters = async ({ page, limit, search }: { page: number; limit: number; search?: string }): Promise<ClusterQueryResult> => {
    const response = await getClusters({ page, limit, search });
    if (!response.success) {
      throw new Error('Failed to fetch clusters');
    }

    return {
      data: response.clusters as GetAllClustersResponse[],
      pagination: response.pagination!,
    };
  };

  const toolbarActions = [
    {
      icon: <Plus className="h-4 w-4" />,
      label: 'Import Cluster',
      onClick: () => setIsImportModalOpen(true),
    },
  ];

  return (
    <DashboardShell>
      <DashboardHeader heading="Clusters" text="Here you can see all of your clusters and their status." />
      {!initialData ? (
        <DataTableSkeleton
          columnCount={5}
          searchableColumnCount={1}
          filterableColumnCount={0}
          actionsCount={1}
          cellWidths={['10rem', '20rem', '12rem', '12rem', '8rem']}
          shrinkZero
        />
      ) : (
        <>
          <DataTable<GetAllClustersResponse>
            columns={columns}
            searchPlaceholder="Search clusters..."
            queryKey={GET_ALL_CLUSTERS_QUERY_KEY}
            queryFn={fetchClusters}
            initialData={initialData}
            toolbarActions={toolbarActions}
          />
          <ClusterConnectModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onConnect={async () => await queryClient.invalidateQueries({ queryKey: [GET_ALL_CLUSTERS_QUERY_KEY] })}
          />
        </>
      )}
    </DashboardShell>
  );
}
