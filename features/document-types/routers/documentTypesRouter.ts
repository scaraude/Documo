import { createTRPCRouter, publicProcedure } from '@/lib/trpc/trpc';
import {
  getDocumentTypeById,
  validateDocumentFile,
  getAllDocumentTypesCached,
} from '../repository/documentTypesRepository';
import {
  documentTypeIdSchema,
  documentFileValidationSchema,
} from '../types/zod';

export const documentTypesRouter = createTRPCRouter({
  // Get all document types - simple cached version
  getAll: publicProcedure.query(async () => {
    const documentTypes = await getAllDocumentTypesCached();
    return documentTypes;
  }),

  // Get document type by ID
  getById: publicProcedure
    .input(documentTypeIdSchema)
    .query(async ({ input }) => {
      const documentType = await getDocumentTypeById(input);
      return documentType;
    }),

  // Validate document file against document type
  validateFile: publicProcedure
    .input(documentFileValidationSchema)
    .mutation(async ({ input }) => {
      const { documentTypeId, fileSize, mimeType } = input;
      const result = await validateDocumentFile(
        documentTypeId,
        fileSize,
        mimeType
      );
      return result;
    }),
});

export type DocumentTypesRouter = typeof documentTypesRouter;
