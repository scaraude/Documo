import type React from 'react';
import { Toaster } from 'sonner';
import TRPCProvider from '../providers/trpc-provider';

export default function ExternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCProvider>
      {/* No AuthProvider - external users don't need authentication context */}
      {/* No Navbar - clean external experience */}
      {children}
      <Toaster richColors />
    </TRPCProvider>
  );
}
