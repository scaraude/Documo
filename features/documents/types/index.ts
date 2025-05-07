import { DocumentStatus, DOCUMENT_TYPES } from '@/shared/constants/documents/types';

export interface DocumentMetadata {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    hash?: string;
}

export interface Document {
    id: string;
    requestId: string;
    type: typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];
    status: DocumentStatus;
    metadata: DocumentMetadata;
    url?: string;
    encryptionKey?: CryptoKey;
    createdAt: Date;
    updatedAt: Date;
    validationErrors?: string[];
}

export interface DocumentUploadProgress {
    documentId: string;
    progress: number;
    status: 'uploading' | 'validating' | 'complete' | 'error';
    error?: string;
}

export interface UploadDocumentParams {
    requestId: string;
    file: File;
    type: typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];
    encryptionKey: CryptoKey;
    onProgress?: (progress: number) => void;
}

export interface DocumentValidationParams {
    document: Document;
    file: File;
} 