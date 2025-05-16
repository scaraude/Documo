import { RequestStatus, DocumentType } from "../constants";
import { DocumentStatus } from "../constants/documents/types";

export interface AppDocumentMetadata {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    hash?: string;
}

//call AppDocument to avoid confusion with Document TS interface
export interface AppDocument {
    id: string;
    requestId: string;
    type: DocumentType;
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
    requestedDocuments: DocumentType[];
    status: RequestStatus;
    createdAt: Date;
    expiresAt: Date;
    updatedAt: Date;
}