// features/documents/hooks/useDocumentUpload.ts
import { useCallback, useState } from 'react';
import { DocumentUploadProgress, UploadDocumentParams } from '../types';
import { AppDocumentType, DocumentStatus } from '@/shared/constants/documents/types';
import { encryptFile, generateEncryptionKey } from '../utils/encryption';
import { uploadDocument as uploadDocumentToApi } from '../api/documentsApi';
import { getRequestById } from '../../requests/api/requestApi';
import { v4 as uuidv4 } from 'uuid';
import { AppDocumentMetadata, AppDocument } from '@/shared/types';

export function useDocumentUpload() {
    const [uploadProgress, setUploadProgress] = useState<DocumentUploadProgress | null>(null);

    const getDocumentToFetchFromRequestId = useCallback(async (requestId: string): Promise<AppDocumentType[]> => {
        const documentRequest = await getRequestById(requestId);

        if (!documentRequest) {
            throw new Error('Request not found');
        }

        return documentRequest?.requestedDocuments || [];
    }, []);

    const extractMetadata = (file: File): AppDocumentMetadata => {
        return {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
        };
    };

    const secureUploadDocument = async ({
        requestId,
        file,
        type,
        onProgress,
    }: UploadDocumentParams): Promise<AppDocument> => {
        try {
            // Create document metadata
            const documentId = uuidv4();
            const document: AppDocument = {
                id: documentId,
                requestId,
                type,
                status: DocumentStatus.UPLOADING,
                metadata: extractMetadata(file),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Update progress
            setUploadProgress({
                documentId: document.id,
                progress: 0,
                status: 'uploading'
            });

            // Encrypt file client-side
            const encryptionKey = await generateEncryptionKey();
            const encryptedFile = await encryptFile(file, encryptionKey);


            // Upload document metadata and file
            const uploadedDocument = await uploadDocumentToApi({
                ...document,
                url: URL.createObjectURL(encryptedFile)
            });

            // Simulate upload progress (in real app, use fetch with progress monitoring)
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 200));
                onProgress?.(i);
                setUploadProgress(prev => prev ? {
                    ...prev,
                    progress: i
                } : null);
            }

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
        encryptFile,
        secureUploadDocument,
        uploadProgress,
        getDocumentToFetchFromRequestId
    };
}