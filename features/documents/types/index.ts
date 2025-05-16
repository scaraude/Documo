import { AppDocumentType } from '@/shared/constants/documents/types';

export interface DocumentUploadProgress {
    documentId: string;
    progress: number;
    status: 'uploading' | 'validating' | 'complete' | 'error';
    error?: string;
}

export interface UploadDocumentParams {
    requestId: string;
    file: File;
    type: AppDocumentType,
    onProgress?: (progress: number) => void;
}

export interface DocumentValidationParams {
    document: Document;
    file: File;
} 