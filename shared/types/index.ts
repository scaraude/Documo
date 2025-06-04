import z from "zod";
import { AppDocumentType } from "../constants";

// Définir un schéma de validation
export const metadataSchema = z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    lastModified: z.number(),
    hash: z.string().optional()
});

export type AppDocumentMetadata = z.infer<typeof metadataSchema>;

export interface DocumentRequest {
    id: string;
    civilId: string;
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

// Computed status type
export type ComputedRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface AppDocument {
    id: string;
    requestId: string;
    folderId?: string;
    type: AppDocumentType;
    metadata: AppDocumentMetadata;
    url?: string;
    createdAt: Date;
    updatedAt: Date;

    // Propriétés pour calculer le status
    uploadedAt?: Date;
    validatedAt?: Date;
    invalidatedAt?: Date;
    errorAt?: Date;
    errorMessage?: string;

    validationErrors?: string[];
}

// Computed status type
export type ComputedDocumentStatus = 'PENDING' | 'UPLOADING' | 'UPLOADED' | 'VALIDATING' | 'VALID' | 'INVALID' | 'ERROR';