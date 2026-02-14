'use client';

import { useAuth } from '@/features/auth';
import { Navbar } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type React from 'react';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { organization, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no organization, redirect to login
    if (!isLoading && !organization) {
      router.push(ROUTES.AUTH.LOGIN);
      toast.error('Veuillez vous connecter');
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

  // If no organization, don't render children (will redirect)
  if (!organization) {
    return null;
  }

  // User is authenticated, render children with navbar
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
