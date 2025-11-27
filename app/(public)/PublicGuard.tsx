'use client';

import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type React from 'react';

interface PublicGuardProps {
  children: React.ReactNode;
}

export default function PublicGuard({ children }: PublicGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and user is authenticated, redirect to folders
    if (!isLoading && user) {
      router.push(ROUTES.FOLDERS.HOME);
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  // If user is authenticated, don't render children (will redirect)
  if (user) {
    return null;
  }

  // User is not authenticated, render public content
  return <>{children}</>;
}
