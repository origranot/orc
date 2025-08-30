'use client';

import { Button } from '@orc/web/ui/magicui/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  // Don't show in production
  // if (process.env.NODE_ENV === 'production') return null;
  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-6 w-6 text-slate-700 dark:hidden" />
      <Moon className="hidden h-6 w-6 text-slate-300 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
