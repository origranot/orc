import { Card, CardContent, Skeleton, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@orc/web/ui/custom-ui';
import { Cluster } from '@prisma/client';
import { Activity, AlertCircle, CheckCircle2, Info, Server, Tag } from 'lucide-react';
import { formatDistanceToNow, differenceInHours } from 'date-fns';

interface ClusterDetailsProps {
  cluster?: Cluster;
  isLoading?: boolean;
}

function LastSeenStatus({ lastSeen }: { lastSeen: Date | null }) {
  if (!lastSeen) return 'Never';

  const hoursSinceLastSeen = differenceInHours(new Date(), new Date(lastSeen));
  const formattedTime = formatDistanceToNow(new Date(lastSeen), { addSuffix: true });

  let status: {
    icon: JSX.Element;
    color: string;
    message: string;
  };

  if (hoursSinceLastSeen > 3) {
    status = {
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      color: 'text-red-500',
      message: 'Cluster might be offline. No updates received in over 3 hours.',
    };
  } else if (hoursSinceLastSeen > 1) {
    status = {
      icon: <Info className="h-4 w-4 text-yellow-500" />,
      color: 'text-yellow-500',
      message: 'Cluster might have connectivity issues. Last update was over an hour ago.',
    };
  } else {
    status = {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      color: 'text-green-500',
      message: 'Cluster is actively reporting its status.',
    };
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-2 text-sm">
          {status.icon}
          <span className={`${status.color} hidden md:inline`}>{formattedTime}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{status.message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function StatusIndicator({ status, lastSeen }: { status: string; lastSeen: Date | null }) {
  const hoursSinceLastSeen = lastSeen ? differenceInHours(new Date(), new Date(lastSeen)) : null;

  const getStatusColor = () => {
    if (!lastSeen || hoursSinceLastSeen === null) return 'bg-gray-500';
    if (hoursSinceLastSeen > 3) return 'bg-red-500';
    if (hoursSinceLastSeen > 1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${getStatusColor()} animate-pulse`} />
      <span className="font-medium capitalize">{status.toLowerCase()}</span>
    </div>
  );
}

export function ClusterDetailsCard({ cluster, isLoading }: ClusterDetailsProps) {
  const details = [
    {
      label: 'Status',
      value: cluster ? <StatusIndicator status={cluster.status} lastSeen={cluster.lastSeen} /> : <Skeleton className="h-6 w-[100px]" />,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
    {
      label: 'Version',
      value: cluster ? cluster.version : <Skeleton className="h-6 w-[100px]" />,
      icon: <Tag className="h-4 w-4 text-muted-foreground" />,
    },
    {
      label: 'Nodes',
      value: cluster ? (
        <div className="flex items-center gap-2">
          <span className="font-medium">{cluster.nodes}</span>
          <span className="text-sm text-muted-foreground">nodes</span>
        </div>
      ) : (
        <Skeleton className="h-6 w-[100px]" />
      ),
      icon: <Server className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-6">
          {details.map(({ label, value, icon }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
              </div>
              <div>{value}</div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 right-4">
          {cluster ? <LastSeenStatus lastSeen={cluster.lastSeen} /> : <Skeleton className="h-4 w-[100px]" />}
        </div>
      </CardContent>
    </Card>
  );
}
