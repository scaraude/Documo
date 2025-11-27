import { createTRPCRouter, publicProcedure } from '@/lib/trpc/trpc';
import {
  getAllDocumentTypesCached,
  getDocumentTypeById,
  validateDocumentFile,
} from '../repository/documentTypesRepository';
import {
  documentFileValidationSchema,
  documentTypeIdSchema,
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
        mimeType,
      );
      return result;
    }),
});

type DocumentTypesRouter = typeof documentTypesRouter;
