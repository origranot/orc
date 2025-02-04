'use client';

import { buttonVariants } from '@orc/web/ui/magicui/ui/button';
import { cn } from '@orc/web/ui/custom-ui/utils';
import { FaGoogle } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { signIn } from 'next-auth/react';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);

  async function onSignInGoogle() {
    setIsGoogleLoading(true);
    signIn('google', { redirect: false });
    setIsGoogleLoading(false);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <button
        type="button"
        className={cn(buttonVariants({ variant: 'outline' }))}
        onClick={() => {
          onSignInGoogle();
        }}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FaGoogle className="mr-2 h-4 w-4" />} Google
      </button>
    </div>
  );
}
