import { requestsRouter } from '@/features/requests/routers/requestsRouter';
import { router } from './trpc';
import { externalRouter } from '../../features/external-requests/routers/externalRequestsRouter';
import { folderTypesRouter } from '../../features/folder-types/routers/folderTypesRouter';

export const appRouter = router({
    requests: requestsRouter,
    external: externalRouter,
    folderTypes: folderTypesRouter,
});

export type AppRouter = typeof appRouter;
