import { z } from 'zod';
import { documentTypeIdsSchema } from '../../document-types/types/zod';

export const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  folderTypeId: z.string().uuid('ID de modèle de dossier invalide'),
  description: z.string().optional(),
  expiresAt: z.date().nullable(),
  requestedDocumentIds: documentTypeIdsSchema,
  createdByOrganizationId: z.string().uuid().optional(),
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

export const RemoveRequestFromFolderSchema = z.object({
  folderId: z.string().uuid('ID de dossier invalide'),
  requestId: z.string().uuid('ID de demande invalide'),
});

export const FolderIdSchema = z.object({
  id: z.string().uuid('ID de dossier invalide'),
});
