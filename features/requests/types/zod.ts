import z from 'zod';
import { APP_DOCUMENT_TYPES } from '../../../shared/constants';

// Schéma de validation pour la création de request
export const createRequestSchema = z.object({
  email: z
    .string()
    .email()
    .transform(email => email.toLowerCase()),
  requestedDocuments: z.nativeEnum(APP_DOCUMENT_TYPES).array(),
  folderId: z.string().uuid(), // Add folder ID
  expirationDays: z.number().optional(),
});
