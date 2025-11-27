import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from './root';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            // Simple caching - document types are static
            staleTime: 30 * 60 * 1000, // 30 minutes
            refetchOnWindowFocus: false,
          },
        },
      },
    };
  },
  ssr: false,
  transformer: superjson,
});

export const trpcVanilla = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      headers() {
        return {
          // Add any headers you need
        };
      },
      transformer: superjson,
    }),
  ],
});
