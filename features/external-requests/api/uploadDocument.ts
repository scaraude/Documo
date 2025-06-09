'use client'

import { v4 as uuidv4 } from 'uuid'
import { encryptFile, exportedKeyBase64 } from '@/features/documents/utils/encryption'
import { AppDocumentType } from '@/shared/constants'
import { AppDocumentToUpload } from '../types'
import { trpcVanilla } from '@/lib/trpc/client'

interface UploadDocumentOptions {
    file: File
    documentType: AppDocumentType
    token: string
    onProgress?: (progress: number) => void
}

interface AppDocumentMetadata {
    name: string
    mimeType: string
    size: number
    lastModified: number
}

const extractMetadata = (file: File): AppDocumentMetadata => ({
    name: file.name,
    mimeType: file.type,
    size: file.size,
    lastModified: file.lastModified
})

export const uploadDocument = async ({
    file,
    documentType,
    token,
    onProgress
}: UploadDocumentOptions): Promise<void> => {
    try {

        // Create document metadata
        const documentId = uuidv4()
        const document: AppDocumentToUpload = {
            id: documentId,
            type: documentType,
            metadata: extractMetadata(file),
            createdAt: new Date(),
            updatedAt: new Date()
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
