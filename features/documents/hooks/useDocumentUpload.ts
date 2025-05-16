import { useCallback, useState } from 'react';
import { DocumentUploadProgress, UploadDocumentParams } from '../types';
import { DOCUMENT_TYPES, DocumentStatus } from '@/shared/constants/documents/types';
import { encryptFile, generateEncryptionKey } from '../utils/encryption';
import { uploadDocument as uploadDocumentToApi } from '../api/documentsApi';
import { getRequestById } from '../../requests/api/requestApi';
import { v4 as uuidv4 } from 'uuid';
import { AppDocumentMetadata, AppDocument } from '@/shared/types';

export function useDocumentUpload() {
    const [uploadProgress, setUploadProgress] = useState<DocumentUploadProgress | null>(null);

    const getDocumentToFetchFromRequestId = useCallback(async (requestId: string): Promise<DOCUMENT_TYPES[]> => {
        const documents = await getRequestById(requestId);
        return documents?.requestedDocuments || [];
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
            const document: AppDocument = {
                id: uuidv4(),
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

            // Encrypt file
            const encryptionKey = await generateEncryptionKey();
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