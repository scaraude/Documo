import TRPCProvider from '../providers/trpc-provider';
import { AuthProvider } from '@/features/auth';
import { Toaster } from 'sonner';
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
