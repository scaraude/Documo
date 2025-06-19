// Export hooks
export { useDocumentTypes } from './hooks/useDocumentTypes';

// Export router
export { documentTypesRouter } from './routers/documentTypesRouter';
export type { DocumentTypesRouter } from './routers/documentTypesRouter';

// Export repository functions
export * from './repository/documentTypesRepository';

// Export Zod schemas
export * from './types/zod';
export * from './types/api';

// Export types
export type { DocumentType } from '@/lib/prisma/generated/client';