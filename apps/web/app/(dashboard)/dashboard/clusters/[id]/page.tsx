'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@orc/web/components/dashboard/shell';
import { Alert, AlertDescription, AlertTitle } from '@orc/web/ui/custom-ui';
import { AlertTriangle } from 'lucide-react';
import { BreadcrumbItems } from '@orc/web/components/breadcrumbs/breadcrumbs';
import { DashboardHeader } from '@orc/web/components/dashboard/header';
import { OrphanedResourcesTable } from './orphaned-resources-table';
import { ClusterDetailsCard } from './cluster-details-card';
import { useClusterQueries } from '@orc/web/hooks/queries/use-cluster-queries';
import type { Cluster } from '@prisma/client';
import { OrphanedResourcesChart } from './orphaned-resources-chart';

export default function ClusterDetailsPage() {
  const params = useParams();
  const clusterId = params.id as string;
  const [timeRange, setTimeRange] = useState(24); // Default to 24h

  const {
    basicInfo,
    isLoadingBasicInfo,
    initialResourcesData,
    isLoadingResources,
    resourcesError,
    fetchOrphanedResources,
    timeseriesData,
    isLoadingTimeseriesData,
    timeseriesError,
  } = useClusterQueries({ clusterId, timeRange });

  const handleTimeRangeChange = (newRange: number) => {
    setTimeRange(newRange);
  };

  if (resourcesError || timeseriesError) {
    return (
      <DashboardShell>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load cluster data. Please try again later.</AlertDescription>
        </Alert>
      </DashboardShell>
    );
  }

  const clusterName = basicInfo?.success ? basicInfo.cluster?.name : 'Cluster';

  return (
    <>
      <BreadcrumbItems
        items={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Clusters', link: '/dashboard/clusters' },
          { name: clusterName || 'Cluster' },
        ]}
      />
      <DashboardShell className="space-y-6">
        <DashboardHeader heading={clusterName} text="Here you can see a detailed view of your cluster and its resources." />
        <ClusterDetailsCard cluster={basicInfo?.success ? (basicInfo.cluster as Cluster) : undefined} isLoading={isLoadingBasicInfo} />
        <OrphanedResourcesChart data={timeseriesData?.data || []} isLoading={isLoadingTimeseriesData} onTimeRangeChange={handleTimeRangeChange} />
        <div className="space-y-4 overflow-hidden">
          <OrphanedResourcesTable
            clusterId={clusterId}
            initialData={initialResourcesData}
            isLoading={isLoadingResources}
            fetchResources={fetchOrphanedResources}
          />
        </div>
      </DashboardShell>
    </>
  );
}
