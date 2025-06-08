import { requestsRouter } from '@/features/requests/routers/requestsRouter';
import { router } from './trpc';
import { externalRouter } from '../../features/external-requests/routers/externalRequestsRouter';
import { folderTypesRouter } from '../../features/folder-types/routers/folderTypesRouter';
import { folderRouter } from '../../features/folders/routers/folderRouter';
import { routerDocument } from '../../features/documents/routers/routerDocument';

export const appRouter = router({
    requests: requestsRouter,
    external: externalRouter,
    folderTypes: folderTypesRouter,
    folder: folderRouter,
    documents: routerDocument
});

export type AppRouter = typeof appRouter;
