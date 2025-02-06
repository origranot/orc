import { useQuery } from '@tanstack/react-query';
import { getClusterBasicInfo } from '@orc/web/actions/cluster';
import { getOrphanedResources } from '@orc/web/actions/cluster/orhpaned-resources';
import { getOrphanedResourcesTimeseries } from '@orc/web/actions/cluster/orphaned-resources-timeseries';

export const QUERY_KEYS = {
  CLUSTER: 'cluster',
  ORPHANED_RESOURCES: 'orphaned-resources',
  TIMESERIES: 'timeseries',
} as const;

interface UseClusterQueriesProps {
  clusterId: string;
  timeRange: number;
}

export function useClusterQueries({ clusterId, timeRange }: UseClusterQueriesProps) {
  const { data: basicInfo, isLoading: isLoadingBasicInfo } = useQuery({
    queryKey: [QUERY_KEYS.CLUSTER, clusterId],
    queryFn: () => getClusterBasicInfo(clusterId),
  });

  const fetchOrphanedResources = async ({
    page,
    limit,
    search,
    sort,
  }: {
    page: number;
    limit: number;
    search?: string;
    sort?: { [field: string]: string };
  }) => {
    const response = await getOrphanedResources({
      clusterId,
      page,
      limit,
      search,
      sort,
      status: 'PENDING',
    });

    if (!response.success) {
      throw new Error('Failed to fetch cluster resources');
    }

    return {
      data: response.data || [],
      provider: response.provider,
      pagination: response.pagination!,
    };
  };

  const {
    data: initialOrphanedResourcesData,
    isLoading: isLoadingResources,
    error: resourcesError,
  } = useQuery({
    queryKey: [QUERY_KEYS.ORPHANED_RESOURCES, clusterId],
    queryFn: () => fetchOrphanedResources({ page: 1, limit: 10 }),
  });

  const {
    data: timeseriesData,
    isLoading: isLoadingTimeseriesData,
    error: timeseriesError,
  } = useQuery({
    queryKey: [QUERY_KEYS.TIMESERIES, clusterId, timeRange],
    queryFn: () => getOrphanedResourcesTimeseries(clusterId, timeRange),
  });

  return {
    basicInfo,
    isLoadingBasicInfo,
    initialOrphanedResourcesData,
    isLoadingResources,
    resourcesError,
    fetchOrphanedResources,
    timeseriesData,
    isLoadingTimeseriesData,
    timeseriesError,
  };
}
