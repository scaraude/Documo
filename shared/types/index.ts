import z from 'zod';
import { APP_DOCUMENT_TYPES, AppDocumentType } from '../constants';

// Create folder type validation schema
export const createFolderTypeSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  requiredDocuments: z.array(z.nativeEnum(APP_DOCUMENT_TYPES)),
  createdById: z.string().optional(),
});

export interface DocumentRequest {
  id: string;
  email: string;
  requestedDocuments: AppDocumentType[];
  createdAt: Date;
  expiresAt: Date;
  updatedAt: Date;

  // Propriétés pour calculer le status
  acceptedAt?: Date;
  rejectedAt?: Date;
  completedAt?: Date;
  firstDocumentUploadedAt?: Date;

  folderId?: string;
}

export interface DocumentRequestWithDocuments extends DocumentRequest {
  documents: AppDocument[];
}

export interface DocumentRequestWithFolder extends DocumentRequest {
  folder: {
    id: string;
    name: string;
  };
}

export interface DocumentRequestWithFolderAndDocuments
  extends DocumentRequestWithDocuments,
    DocumentRequestWithFolder {}

export interface DocumentRequestWithStatue extends DocumentRequest {
  status: ComputedRequestStatus;
}

// Computed status type
export type ComputedRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED';

export interface AppDocumentWithStatus extends AppDocument {
  status: ComputedDocumentStatus;
}

export const AppDocumentSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  folderId: z.string().optional(),
  type: z.nativeEnum(APP_DOCUMENT_TYPES),
  fileName: z.string(),
  mimeType: z.string(),
  originalSize: z.number(),
  url: z.string().url(),
  hash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),

  // Propriétés pour calculer le status
  uploadedAt: z.date(),
  validatedAt: z.date().optional(),
  invalidatedAt: z.date().optional(),
  errorAt: z.date().optional(),
  errorMessage: z.string().optional(),

  validationErrors: z.array(z.string()).optional(),
  dek: z.string(), // Data Encryption Key, utilisé pour chiffrer le document
});

export type AppDocument = z.infer<typeof AppDocumentSchema>;
// Computed status type
export type ComputedDocumentStatus =
  | 'PENDING'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'VALIDATING'
  | 'VALID'
  | 'INVALID'
  | 'ERROR';
