import z from 'zod';
import {
  documentTypeIdsSchema,
} from '../../document-types/types/zod';

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

// Schéma de validation pour la mise à jour de request
const updateRequestSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase())
    .optional(),
  requestedDocumentIds: documentTypeIdsSchema.optional(),
  expirationDays: z.number().positive().optional(),
});

// Router input schemas
export const RequestIdSchema = z.object({
  id: z.string().uuid('ID de demande invalide'),
});

export const DeleteRequestSchema = z.object({
  id: z.string().uuid('ID de demande invalide'),
});

const UpdateRequestInputSchema = z.object({
  id: z.string().uuid('ID de demande invalide'),
  data: updateRequestSchema,
});

// Type exports
type CreateRequest = z.infer<typeof createRequestSchema>;
type UpdateRequest = z.infer<typeof updateRequestSchema>;
type RequestId = z.infer<typeof RequestIdSchema>;
type DeleteRequest = z.infer<typeof DeleteRequestSchema>;
type UpdateRequestInput = z.infer<typeof UpdateRequestInputSchema>;
