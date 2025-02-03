import type { ColumnDef } from '@tanstack/react-table';
import type { OrphanedResource } from '@prisma/client';
import { getResourceAge } from '@orc/utils';
import { SortButton } from '@orc/web/components/data-table/utils';
import { Badge, HoverCard, HoverCardContent, HoverCardTrigger } from '@orc/web/ui/custom-ui';
import { InfoIcon } from 'lucide-react';
function getCostStyle(cost: number | null): { bgColor: string; textColor: string } {
  if (cost === null) return { bgColor: 'bg-gray-300', textColor: 'text-gray-700' }; // No cost
  if (cost < 10) return { bgColor: 'bg-green-400', textColor: 'text-black' }; // Low cost
  if (cost < 50) return { bgColor: 'bg-yellow-400', textColor: 'text-black' }; // Medium cost
  return { bgColor: 'bg-red-400', textColor: 'text-white' }; // High cost
}

export const columns: ColumnDef<OrphanedResource>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{name}</span>
          {row.original.reason && (
            <HoverCard>
              <HoverCardTrigger>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{row.original.reason}</p>
                  <Badge variant="outline" className="text-xs scale-90 origin-left font-medium whitespace-nowrap">
                    UID: {row.original.uid}
                  </Badge>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'kind',
    header: ({ column }) => <SortButton column={column}>Kind</SortButton>,
  },
  {
    accessorKey: 'namespace',
    header: 'Namespace',
    cell: ({ row }) => {
      if (row.original.namespace) {
        return row.original.namespace;
      }

      return '*';
    },
  },
  {
    accessorKey: 'age',
    header: ({ column }) => <SortButton column={column}>Age</SortButton>,
    cell: ({ row }) => {
      if (row.original.age) {
        return getResourceAge(new Date(row.original.age));
      }

      return 'N/A';
    },
  },
  {
    accessorKey: 'cost',
    header: ({ column }) => <SortButton column={column}>Cost</SortButton>,
    cell: ({ row }) => {
      const cost = row.original.cost || 0; // Default to 0 if cost is null
      const variant = cost != null ? (cost > 20 ? 'destructive' : cost > 0 ? 'warning' : 'success') : 'secondary';

      return (
        <div className="flex items-center justify-center">
          <Badge variant={variant} className="text-xs px-2 py-0.5">
            {cost != null ? `${cost}$` : 'N/A'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'discoveredAt',
    header: ({ column }) => <SortButton column={column}>Discovered At</SortButton>,
    cell: ({ row }) => {
      if (row.original.discoveredAt) {
        return new Date(row.original.discoveredAt).toLocaleString();
      }

      return 'N/A';
    },
  },
];
