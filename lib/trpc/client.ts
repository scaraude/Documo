import { createTRPCNext } from '@trpc/next';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './root';
import superjson from 'superjson';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
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
