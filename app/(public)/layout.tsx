import { Toaster } from 'sonner';
import TRPCProvider from '../providers/trpc-provider';
import { AuthProvider } from '@/features/auth';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCProvider>
      <AuthProvider>
        {/* No Navbar - clean public experience */}
        {children}
        <Toaster richColors />
      </AuthProvider>
    </TRPCProvider>
  );
}
