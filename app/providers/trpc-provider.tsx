'use client';
import { trpc } from '@/lib/trpc/client';

function TRPCProviderComponent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default trpc.withTRPC(
  TRPCProviderComponent
) as typeof TRPCProviderComponent;
