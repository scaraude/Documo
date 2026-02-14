import { z } from 'zod';
import { documentTypeIdsSchema } from '../../document-types/types/zod';

export const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  folderTypeId: z.string().uuid('ID de modèle de dossier invalide'),
  description: z.string().optional(),
  expiresAt: z.date().nullable(),
  requestedDocumentIds: documentTypeIdsSchema,
  createdById: z.string().uuid().optional(),
});

const UpdateFolderSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').optional(),
  description: z.string().optional(),
  expiresAt: z.date().nullable().optional(),
  requestedDocuments: documentTypeIdsSchema.optional(),
});

// Router input schemas
export const UpdateFolderInputSchema = z.object({
  id: z.string().uuid('ID de dossier invalide'),
  data: z.object({
    name: z.string().min(1, 'Le nom est requis').optional(),
    description: z.string().optional(),
    requestedDocuments: z
      .array(z.string().uuid('ID de document invalide'))
      .optional(),
    expiresAt: z.date().nullable().optional(),
    sharedWith: z.array(z.string().uuid('ID utilisateur invalide')).optional(),
  }),
});

export const AddRequestToFolderSchema = z.object({
  folderId: z.string().uuid('ID de dossier invalide'),
  requestId: z.string().uuid('ID de demande invalide'),
});

export const FolderIdSchema = z.object({
  id: z.string().uuid('ID de dossier invalide'),
});

export const RequestIdSchema = z.object({
  requestId: z.string().uuid('ID de demande invalide'),
});

// Type exports
type CreateFolder = z.infer<typeof CreateFolderSchema>;
type UpdateFolder = z.infer<typeof UpdateFolderSchema>;
type UpdateFolderInput = z.infer<typeof UpdateFolderInputSchema>;
type AddRequestToFolder = z.infer<typeof AddRequestToFolderSchema>;
type FolderId = z.infer<typeof FolderIdSchema>;
type RequestId = z.infer<typeof RequestIdSchema>;
