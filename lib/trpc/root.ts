import { requestsRouter } from '@/features/requests/routers/requestsRouter';
import { router } from './trpc';
import { externalRouter } from '../../features/external-requests/routers/externalRequestsRouter';
import { folderTypesRouter } from '../../features/folder-types/routers/folderTypesRouter';
import { folderRouter } from '../../features/folders/routers/folderRouter';
import { routerDocument } from '../../features/documents/routers/documentRouter';
import { authRouter } from '../../features/auth/routers/authRouter';
import { documentTypesRouter } from '../../features/document-types/routers/documentTypesRouter';

export const appRouter = router({
  requests: requestsRouter,
  external: externalRouter,
  folderTypes: folderTypesRouter,
  folder: folderRouter,
  documents: routerDocument,
  documentTypes: documentTypesRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
