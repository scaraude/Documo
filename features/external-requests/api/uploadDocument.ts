'use client'

import { v4 as uuidv4 } from 'uuid'
import { encryptFile, exportedKeyBase64, computeFileHash } from '@/features/documents/utils/encryption'
import { AppDocumentType } from '@/shared/constants'
import { AppDocumentToUpload } from '../types'
import { trpcVanilla } from '@/lib/trpc/client'

interface UploadDocumentOptions {
    file: File
    documentType: AppDocumentType
    token: string
    onProgress?: (progress: number) => void
}


export const uploadDocument = async ({
    file,
    documentType,
    token,
    onProgress
}: UploadDocumentOptions): Promise<void> => {
    try {

        // Create document metadata
        const documentId = uuidv4()
        const fileHash = await computeFileHash(file)
        const document: AppDocumentToUpload = {
            id: documentId,
            type: documentType,
            createdAt: new Date(),
            updatedAt: new Date(),
            fileName: file.name,
            mimeType: file.type,
            originalSize: file.size,
            hash: fileHash,
            uploadedAt: new Date(),
        }


        const { encryptedFile, encryptionKey } = await encryptFile(file)

        const keyBase64 = await exportedKeyBase64(encryptionKey)

        trpcVanilla.external.createDocument.mutate({
            document,
            encryptedFile,
            token,
            dek: keyBase64
        })

        // Simulate upload progress for now
        if (onProgress) {
            let progress = 0
            const interval = setInterval(() => {
                progress += 10
                onProgress(Math.min(progress, 100))
                if (progress >= 100) {
                    clearInterval(interval)
                }
            }, 500)
        }
    } catch (error) {
        console.error('Error uploading document:', error)
        throw error
    }
}
