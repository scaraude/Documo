import { useState } from 'react';
import { Document, DocumentUploadProgress, UploadDocumentParams } from '../types';
import { DocumentStatus } from '@/shared/constants/documents/types';
import { encryptFile } from '../utils/encryption';
import { validateDocument } from '../utils/validation';
import { uploadDocument as uploadDocumentToApi } from '../api/documentsApi';

export function useDocumentUpload() {
    const [uploadProgress, setUploadProgress] = useState<DocumentUploadProgress | null>(null);

    const uploadDocument = async ({
        requestId,
        file,
        type,
        encryptionKey,
        onProgress
    }: UploadDocumentParams): Promise<Document> => {
        try {
            // Create document metadata
            const document: Document = {
                id: crypto.randomUUID(),
                requestId,
                type,
                status: DocumentStatus.UPLOADING,
                metadata: {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Update progress
            setUploadProgress({
                documentId: document.id,
                progress: 0,
                status: 'uploading'
            });

            // Encrypt file
            const encryptedFile = await encryptFile(file, encryptionKey);

            // Upload encrypted file to API
            const uploadedDocument = await uploadDocumentToApi({
                ...document,
                url: URL.createObjectURL(encryptedFile)
            });

            // Simulate upload progress (replace with actual upload logic)
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 200));
                onProgress?.(i);
                setUploadProgress(prev => prev ? {
                    ...prev,
                    progress: i
                } : null);
            }

            // Validate document
            setUploadProgress(prev => prev ? {
                ...prev,
                status: 'validating'
            } : null);

            const validationResult = await validateDocument(uploadedDocument, file);
            if (!validationResult.isValid) {
                uploadedDocument.status = DocumentStatus.INVALID;
                uploadedDocument.validationErrors = validationResult.errors;
                throw new Error(validationResult.errors.join(', '));
            }

            // Update document status
            uploadedDocument.status = DocumentStatus.VALID;
            uploadedDocument.encryptionKey = encryptionKey;
            uploadedDocument.updatedAt = new Date();

            // Update progress
            setUploadProgress(prev => prev ? {
                ...prev,
                status: 'complete',
                progress: 100
            } : null);

            return uploadedDocument;
        } catch (error) {
            setUploadProgress(prev => prev ? {
                ...prev,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed'
            } : null);
            throw error;
        }
    };

    return {
        uploadDocument,
        uploadProgress
    };
} 