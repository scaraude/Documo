'use client';
import { trpc } from '@/lib/trpc/client';
import type React from 'react';

function TRPCProviderComponent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default trpc.withTRPC(
  TRPCProviderComponent,
) as typeof TRPCProviderComponent;
