'use client';

import {
  computeFileHash,
  encryptFile,
  exportedKeyBase64,
} from '@/features/documents/utils/encryption';
import { trpcVanilla } from '@/lib/trpc/client';
import { v4 as uuidv4 } from 'uuid';
import type { DocumentTypeId } from '../../document-types/client';
import type { AppDocumentToUpload } from '../types';

interface UploadDocumentOptions {
  file: File;
  documentTypeId: DocumentTypeId;
  token: string;
  onProgress?: (progress: number) => void;
}

export const uploadDocument = async ({
  file,
  documentTypeId,
  token,
  onProgress,
}: UploadDocumentOptions): Promise<void> => {
  try {
    // Create document metadata
    const documentId = uuidv4();
    const fileHash = await computeFileHash(file);
    const document: AppDocumentToUpload = {
      id: documentId,
      typeId: documentTypeId,
      createdAt: new Date(),
      updatedAt: new Date(),
      fileName: file.name,
      mimeType: file.type,
      originalSize: file.size,
      hash: fileHash,
      uploadedAt: new Date(),
    };

    const { encryptedFile, encryptionKey } = await encryptFile(file);

    const keyBase64 = await exportedKeyBase64(encryptionKey);

    trpcVanilla.external.createDocument.mutate({
      document,
      encryptedFile,
      token,
      dek: keyBase64,
    });

    // Simulate upload progress for now
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(Math.min(progress, 100));
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 500);
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};
