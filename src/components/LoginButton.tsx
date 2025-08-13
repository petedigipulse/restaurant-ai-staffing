'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import Link from 'next/link';

export function LoginButton() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      localStorage.setItem('userEmail', session.user.email);
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <Button disabled>
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Welcome, {session.user?.name || session.user?.email}
        </span>
        <Button 
          variant="outline" 
          onClick={() => {
            signOut();
            localStorage.removeItem('userEmail');
          }}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Sign In
      </Button>
    </Link>
  );
}
