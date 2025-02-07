'use client';

import type { OrphanedResource } from '@prisma/client';
import { DataTable } from '@orc/web/components/data-table/data-table';
import { DataTableSkeleton } from '@orc/web/components/shared/advanced-skeleton';
import { columns } from './orphaned-resources-columns';
import React from 'react';

interface OrphanedResourcesTableProps {
  clusterId: string;
  initialData?: {
    data: OrphanedResource[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
  isLoading?: boolean;
  fetchResources: (params: { page: number; limit: number; search?: string; sort: { [field: string]: string } }) => Promise<any>;
}

export function OrphanedResourcesTable({ clusterId, initialData, isLoading, fetchResources }: OrphanedResourcesTableProps) {
  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={4}
        searchableColumnCount={1}
        filterableColumnCount={0}
        actionsCount={0}
        cellWidths={['10rem', '20rem', '12rem', '12rem']}
        shrinkZero
      />
    );
  }

  return (
    <div>
      <DataTable<OrphanedResource>
        columns={columns}
        tableTitle="Orphaned Resources"
        queryKey={`orphanedResources-${clusterId}`}
        queryFn={fetchResources}
        initialData={initialData}
        searchPlaceholder="Search orphaned resources..."
      />
    </div>
  );
}
