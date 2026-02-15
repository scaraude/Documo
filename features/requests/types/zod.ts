import z from 'zod';
import { documentTypeIdsSchema } from '../../document-types/types/zod';

// Schéma de validation pour la création de request
export const createRequestSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  requestedDocumentIds: documentTypeIdsSchema,
  folderId: z.string().uuid(),
  expirationDays: z.number().positive().optional(),
});

// Router input schemas
export const RequestIdSchema = z.object({
  id: z.string().uuid('ID de demande invalide'),
});

export const DeleteRequestSchema = z.object({
  id: z.string().uuid('ID de demande invalide'),
});
