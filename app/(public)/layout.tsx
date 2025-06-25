import { Toaster } from 'sonner';
import TRPCProvider from '../providers/trpc-provider';
import { AuthProvider } from '@/features/auth';
import PublicGuard from './PublicGuard';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCProvider>
      <AuthProvider>
        <PublicGuard>{children}</PublicGuard>
        <Toaster richColors />
      </AuthProvider>
    </TRPCProvider>
  );
}
