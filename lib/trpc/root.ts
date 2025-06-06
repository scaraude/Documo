import { publicProcedure, router } from './trpc';

export const appRouter = router({
    hello: publicProcedure
        .query(() => {
            return { message: 'Hello from tRPC! Copain' };
        }),
});

export type AppRouter = typeof appRouter;
