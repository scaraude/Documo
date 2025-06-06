import { requestsRouter } from '@/features/requests/routers/requestsRouter';
import { router } from './trpc';

export const appRouter = router({
    requests: requestsRouter,
});

export type AppRouter = typeof appRouter;
