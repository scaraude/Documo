import z from 'zod';
import {
  documentTypeIdsSchema,
  documentTypeIdSchema,
} from '../../document-types/types/zod';

// Schéma de validation pour la création de request
export const createRequestSchema = z.object({
  email: z
    .string()
    .email()
    .transform(email => email.toLowerCase()),
  requestedDocuments: documentTypeIdsSchema,
  folderId: z.string().uuid(),
  expirationDays: z.number().positive().optional(),
});

// Schéma de validation pour la mise à jour de request
export const updateRequestSchema = z.object({
  email: z
    .string()
    .email()
    .transform(email => email.toLowerCase())
    .optional(),
  requestedDocuments: documentTypeIdsSchema.optional(),
  expirationDays: z.number().positive().optional(),
});

// Schéma pour un seul type de document
export const requestDocumentTypeSchema = documentTypeIdSchema;

// Type exports
export type CreateRequest = z.infer<typeof createRequestSchema>;
export type UpdateRequest = z.infer<typeof updateRequestSchema>;
