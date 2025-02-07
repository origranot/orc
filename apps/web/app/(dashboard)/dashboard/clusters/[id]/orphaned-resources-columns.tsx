import type { ColumnDef } from '@tanstack/react-table';
import type { OrphanedResource } from '@prisma/client';
import { getResourceAge } from '@orc/utils';
import { SortButton } from '@orc/web/components/data-table/utils';
import { Badge, HoverCard, HoverCardContent, HoverCardTrigger } from '@orc/web/ui/custom-ui';
import { InfoIcon } from 'lucide-react';

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
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
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
    accessorKey: 'costType',
    header: ({ column }) => <SortButton column={column}>Cost</SortButton>,
    cell: ({ row }) => {
      const costType = row.original.costType;
      const variant = costType === 'DIRECT' ? 'destructive' : costType === 'INDIRECT' ? 'warning' : 'success';

      return (
        <HoverCard>
          <HoverCardTrigger>
            <Badge variant={variant} className="text-xs px-2 py-0.5 cursor-pointer">
              {costType === 'DIRECT' || costType === 'INDIRECT' ? '$' : '-'}
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent className="w-60">
            <div className="space-y-2">
              <p className="text-sm">
                {costType === 'DIRECT' && 'This resource directly incurs cloud provider charges'}
                {costType === 'INDIRECT' && 'This resource uses resources that cost money'}
                {costType === 'NONE' && 'This resource does not incur any charges'}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
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
