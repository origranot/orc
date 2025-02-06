'use client';

import {
  cn,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Skeleton,
} from '@orc/web/ui/custom-ui';
import { FC, useEffect, useMemo } from 'react';
import { BreadcrumbListItem, useBreadcrumbs } from '@orc/web/providers/breadcrumbs-provider';
import { usePathname } from 'next/navigation';

type BreadcrumbsProps = {
  className?: string;
};

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ className }) => {
  const { items, setItems } = useBreadcrumbs();
  const pathname = usePathname();

  useEffect(() => {
    setItems(undefined);
  }, [pathname]);

  const content = useMemo(() => {
    return items?.flatMap((item, index) => {
      if (!item.name) {
        return [
          index > 0 && <BreadcrumbSeparator key={`breadcrumb-separator-${index}`} />,
          <BreadcrumbItem key={`breadcrumb-skeleton-${index}`}>
            <Skeleton className="w-24 h-4" />
          </BreadcrumbItem>,
        ];
      }

      return [
        index > 0 && <BreadcrumbSeparator key={`breadcrumb-separator-${index}-${item.name}`} />,
        !item.link ? (
          <BreadcrumbItem key={`breadcrumb-list-item-${index}-${item.name}`}>
            <BreadcrumbPage>{item.name}</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={`breadcrumb-list-item-${index}-${item.name}`}>
            <BreadcrumbLink href={item.link}>{item.name}</BreadcrumbLink>
          </BreadcrumbItem>
        ),
      ];
    });
  }, [items]);

  return (
    <Breadcrumb className={cn('px-2', className)}>
      <BreadcrumbList>{content}</BreadcrumbList>
    </Breadcrumb>
  );
};

type BreadcrumbItemsProps = {
  items?: BreadcrumbListItem[];
};

export const BreadcrumbItems: FC<BreadcrumbItemsProps> = ({ items }) => {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems(items);
  }, [items]);

  return <></>;
};
