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
  const { organization, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and organization is authenticated, redirect to folders
    if (!isLoading && organization) {
      router.push(ROUTES.FOLDERS.HOME);
    }
  }, [organization, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  // If organization is authenticated, don't render children (will redirect)
  if (organization) {
    return null;
  }

  // User is not authenticated, render public content
  return <>{children}</>;
}
