import { z } from 'zod';
import { AppDocumentSchema } from '../../../shared/types';
import { documentTypeIdsSchema } from '../../document-types/types/zod';

// Schema for external request response
export const externalRequestSchema = z.object({
  id: z.string(),
  email: z.string(),
  requestedDocumentIds: documentTypeIdsSchema,
  createdAt: z.date(),
  expiresAt: z.date(),
  acceptedAt: z.date().nullable().optional(),
  rejectedAt: z.date().nullable().optional(),
  declineMessage: z.string().nullable().optional(),
});

export const externalCreateDocumentSchema = z.object({
  encryptedFile: z.instanceof(Uint8Array<ArrayBufferLike>),
  token: z.string().min(1, 'Token is required'),
  document: AppDocumentSchema.omit({
    requestId: true,
    dek: true,
    url: true,
    typeId: true,
  }).extend({
    typeId: z.string(), // DocumentTypeId
  }),
  dek: z.string().base64().min(1, 'Data Encryption Key is required'),
});
