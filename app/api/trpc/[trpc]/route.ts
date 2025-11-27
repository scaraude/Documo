import { setupEventHandlers } from '@/lib/events/setup';
import { appRouter } from '@/lib/trpc/root';
//app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

// Initialize event handlers on server startup
setupEventHandlers();

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: ({ req, resHeaders }) => ({
      req: req as NextRequest,
      resHeaders,
    }),
  });

export { handler as GET, handler as POST };
