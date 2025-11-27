import z from 'zod';
import {
  documentTypeIdSchema,
  documentTypeIdsSchema,
} from '../../document-types/types/zod';

// Schéma de validation pour la création de request
export const createRequestSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  requestedDocuments: documentTypeIdsSchema,
  folderId: z.string().uuid(),
  expirationDays: z.number().positive().optional(),
});

// Schéma de validation pour la mise à jour de request
export const updateRequestSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase())
    .optional(),
  requestedDocuments: documentTypeIdsSchema.optional(),
  expirationDays: z.number().positive().optional(),
});

// Router input schemas
export const RequestIdSchema = z.object({
  id: z.string().uuid('ID de demande invalide'),
});

export const DeleteRequestSchema = z.object({
  id: z.string().uuid('ID de demande invalide'),
});

export const UpdateRequestInputSchema = z.object({
  id: z.string().uuid('ID de demande invalide'),
  data: updateRequestSchema,
});

// Schéma pour un seul type de document
export const requestDocumentTypeSchema = documentTypeIdSchema;

// Type exports
export type CreateRequest = z.infer<typeof createRequestSchema>;
export type UpdateRequest = z.infer<typeof updateRequestSchema>;
export type RequestId = z.infer<typeof RequestIdSchema>;
export type DeleteRequest = z.infer<typeof DeleteRequestSchema>;
export type UpdateRequestInput = z.infer<typeof UpdateRequestInputSchema>;
