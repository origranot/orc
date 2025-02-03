'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@orc/web/ui/custom-ui';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import * as Dialog from '@radix-ui/react-dialog'; // Import Radix Dialog

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  searchPlaceholder?: string;
  queryKey: string;
  tableTitle?: string;
  queryFn: (params: { page: number; limit: number; search?: string; sort: {[field: string]: string} }) => Promise<{
    data: TData[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  }>;
  initialData?: {
    data: TData[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
  toolbarActions?: {
    icon?: React.ReactNode;
    label: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: () => void;
  }[];
  showViewOptions?: boolean;
  onRowClick?: (row: any) => any
}

export function DataTable<TData>({
  columns,
  searchPlaceholder = 'Search...',
  queryKey,
  queryFn,
  initialData,
  toolbarActions = [],
  showViewOptions = true,
  tableTitle,
  onRowClick
}: DataTableProps<TData>) {
  const queryClient = useQueryClient();
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);

  const { data } = useQuery({
    queryKey: [queryKey, pageIndex, pageSize, searchQuery, sorting],
    queryFn: async () => {
      const result = await queryFn({
        page: pageIndex + 1,
        limit: pageSize,
        search: searchQuery,
        sort: sorting.reduce((acc, sort) => ({ ...acc, [sort.id]: sort.desc ? 'desc' : 'asc' }), {}),
      });
      setIsFirstLoad(false);
      return result;
    },
    initialData: isFirstLoad ? initialData : undefined,
    placeholderData: (previousData) => previousData,
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: data?.pagination?.totalPages ?? -1,
    manualPagination: true,
    meta: {
      onDelete: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    },
  });

  return (
    <div>
    { tableTitle &&<h2 className="p-3 text-lg font-semibold">{tableTitle} ({data?.pagination.total})</h2>}
    <div className="space-y-4 overflow-hidden bg-card text-card-foreground shadow-sm p-4 border rounded-lg w-full sm:max-w-full">
      <DataTableToolbar
        table={table}
        placeholder={searchPlaceholder}
        actions={toolbarActions}
        showViewOptions={showViewOptions}
        onSearch={setSearchQuery}
      />
      <div className="rounded-md border overflow-hidden relative">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} onClick={() => onRowClick && onRowClick(row)} className={onRowClick ? "cursor-pointer" : ""}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalItems={data?.pagination?.total ?? 0} />
    </div>
    </div>
  );
}