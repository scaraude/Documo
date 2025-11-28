import z from 'zod';
import {
  type AppDocumentType,
  documentTypeIdSchema,
} from '@/features/document-types/types/zod';

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

interface DocumentRequestWithDocuments extends DocumentRequest {
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
  DocumentRequestWithFolder { }

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
  id: z.string().uuid(),
  requestId: z.string().uuid(),
  folderId: z.string().uuid().optional(),
  typeId: documentTypeIdSchema,
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
export type AppDocumentToUpload = Omit<AppDocument, 'type'> & {
  typeId: string; // DocumentTypeId
};
// Computed status type
export type ComputedDocumentStatus =
  | 'PENDING'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'VALIDATING'
  | 'VALID'
  | 'INVALID'
  | 'ERROR';
