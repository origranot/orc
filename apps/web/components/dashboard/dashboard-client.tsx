'use client';

import { useEffect } from 'react';
import { DashboardHeader } from '@orc/web/components/dashboard/header';
import { DashboardShell } from '@orc/web/components/dashboard/shell';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Skeleton,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@orc/web/ui/custom-ui';
import { Server, AlertTriangle, Trash2, Activity } from 'lucide-react';
import { BarChart } from '@orc/web/components/charts/bar-chart';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@orc/web/actions/dasboard';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, formatRelative } from 'date-fns';
import { NoData } from '@orc/web/components/shared/no-data';
import { Provider } from '@prisma/client';
import { ClusterNameCell } from '@orc/web/app/(dashboard)/dashboard/clusters/columns';

interface DashboardStats {
  totalClusters: number;
  totalOrphanedResources: number;
  clustersWithOrphanedResources: number;
  averageHealthScore: number | null;
}

interface ClusterData {
  id: string;
  name: string;
  provider: Provider;
  orphanedResources: number;
  lastSeen: Date;
}

interface DashboardData {
  stats: DashboardStats;
  orphanedResourcesByCluster: { clusterName: string; orphanedResources: number }[];
  topClustersWithOrphanedResources: ClusterData[];
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[80px] mb-1" />
        <Skeleton className="h-3 w-[120px]" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[60px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[60px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-[100px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function LastSeenCell({ date }: { date: Date | null }) {
  if (!date) return <span className="text-muted-foreground">Never</span>;

  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - new Date(date).getTime()) / 36e5;

  let color = 'text-green-500';
  if (diffInHours > 3) {
    color = 'text-red-500';
  } else if (diffInHours > 1) {
    color = 'text-yellow-500';
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${color} font-medium`}>{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last seen on {formatRelative(new Date(date), new Date())}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function DashboardContent() {
  const { push } = useRouter();

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const response = await getDashboardData();

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dashboard data');
      }

      return response.data as DashboardData;
    },
  });

  useEffect(() => {
    console.log('Dashboard state:', { isLoading, data, error });
  }, [isLoading, data, error]);

  if (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Overview of your clusters and orphaned resources" />
        <div className="p-4 text-destructive">Error loading dashboard data: {error.message}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your clusters and orphaned resources" />

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clusters</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.stats.totalClusters ? data.stats.totalClusters : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Active Kubernetes clusters</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orphaned Resources</CardTitle>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.stats.totalOrphanedResources ? data.stats.totalOrphanedResources : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Across all clusters</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clusters with Orphaned Resources</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.stats.clustersWithOrphanedResources ? data.stats.clustersWithOrphanedResources : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">Requiring attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Health Score</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.stats.averageHealthScore ? data.stats.averageHealthScore : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Across all clusters</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top Orphaned Resources by Cluster</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {isLoading ? (
            <div className="w-full h-full bg-muted/10 animate-pulse rounded-lg" />
          ) : data?.orphanedResourcesByCluster && data.orphanedResourcesByCluster.length > 0 ? (
            <BarChart
              data={data.orphanedResourcesByCluster}
              index="clusterName"
              categories={[{ key: 'orphanedResources', label: 'Orphaned Resources' }]}
              yAxisWidth={48}
            />
          ) : (
            <NoData message="No orphaned resources data available" />
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top 5 Clusters with Orphaned Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cluster Name</TableHead>
                <TableHead>Orphaned Resources</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : data?.topClustersWithOrphanedResources && data.topClustersWithOrphanedResources.length > 0 ? (
                data.topClustersWithOrphanedResources.map((cluster) => (
                  <TableRow key={cluster.id}>
                    <TableCell className="font-medium">
                      <ClusterNameCell id={cluster.id} name={cluster.name} provider={cluster.provider} />
                    </TableCell>
                    <TableCell>{cluster.orphanedResources}</TableCell>
                    <TableCell>
                      <LastSeenCell date={cluster.lastSeen} />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => push(`/dashboard/clusters/${cluster.id}`)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <NoData message="No cluster data available" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
