import { z } from 'zod';
import { documentTypeIdsSchema } from '../../document-types/types/zod';

export const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  folderTypeId: z.string().uuid('ID de type de dossier invalide'),
  description: z.string().optional(),
  expiresAt: z.date().nullable(),
  requestedDocuments: documentTypeIdsSchema,
  createdById: z.string().uuid().optional(),
});

export const UpdateFolderSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').optional(),
  description: z.string().optional(),
  expiresAt: z.date().nullable().optional(),
  requestedDocuments: documentTypeIdsSchema.optional(),
});

// Type exports
export type CreateFolder = z.infer<typeof CreateFolderSchema>;
export type UpdateFolder = z.infer<typeof UpdateFolderSchema>;
