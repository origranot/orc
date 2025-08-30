'use client';

import { buttonVariants, cn, Skeleton } from '@orc/web/ui/custom-ui';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { siteConfig } from '@orc/web/config/site';
import Drawer from '@orc/web/ui/magicui/ui/drawer';
import { ThemeToggle } from '@orc/web/components/theme-toggle';

export const SiteHeader = () => {
  const { status } = useSession();
  const [addBorder, setAddBorder] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setAddBorder(true);
      } else {
        setAddBorder(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const authLinks = useMemo(() => {
    switch (status) {
      case 'loading':
        return <Skeleton className="w-[107px] h-10" />;
      case 'authenticated':
        return (
          <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
            Dashboard
          </Link>
        );
      case 'unauthenticated':
      default:
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
              Login
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ variant: 'default' }), 'w-full sm:w-auto text-background flex gap-2')}>
              Get Started
            </Link>
          </div>
        );
    }
  }, [status]);

  return (
    <>
      <header className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container flex items-center justify-between">
          <Link href="/" title="brand-logo" className="relative flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">{authLinks}</div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <Drawer />
          </div>
        </div>
      </header>
      
      {/* Theme Toggle - Fixed at bottom left */}
      <ThemeToggle />
    </>
  );
};

export default SiteHeader;
