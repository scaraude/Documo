import { AuthProvider } from '@/features/auth';
import type React from 'react';
import { Toaster } from 'sonner';
import TRPCProvider from '../providers/trpc-provider';
import AuthGuard from './AuthGuard';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return (
    <TRPCProvider>
      <AuthProvider>
        <AuthGuard>{children}</AuthGuard>
        <Toaster richColors />
      </AuthProvider>
    </TRPCProvider>
  );
}
