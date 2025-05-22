import z from "zod";
import { DocumentRequestStatus, AppDocumentType } from "../constants";
import { DocumentStatus } from "../constants/documents/types";

// Définir un schéma de validation
export const metadataSchema = z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    lastModified: z.number(),
    hash: z.string().optional()
});

export type AppDocumentMetadata = z.infer<typeof metadataSchema>;

//call AppDocument to avoid confusion with Document TS interface
export interface AppDocument {
    id: string;
    requestId: string;
    type: AppDocumentType;
    status: DocumentStatus;
    metadata: AppDocumentMetadata;
    url?: string;
    encryptionKey?: CryptoKey;
    createdAt: Date;
    updatedAt: Date;
    validationErrors?: string[];
}

export interface DocumentRequest {
    id: string;
    civilId: string;
    requestedDocuments: AppDocumentType[];
    status: DocumentRequestStatus;
    createdAt: Date;
    expiresAt: Date;
    updatedAt: Date;
    folderId?: string; // Optional folder ID
}