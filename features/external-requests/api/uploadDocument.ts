import { v4 as uuidv4 } from 'uuid'
import { generateEncryptionKey, encryptFile } from '../utils/encryption'

interface UploadDocumentOptions {
    file: File
    documentType: string
    token: string
    onProgress?: (progress: number) => void
}

interface AppDocumentMetadata {
    name: string
    type: string
    size: number
    lastModified: number
}

const extractMetadata = (file: File): AppDocumentMetadata => ({
    name: file.name,
    type: file.type,
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
        const document = {
            id: documentId,
            token,
            type: documentType,
            status: 'UPLOADING',
            metadata: extractMetadata(file),
            createdAt: new Date(),
            updatedAt: new Date()
        }

        // Encrypt file client-side
        const encryptionKey = await generateEncryptionKey()
        const encryptedFile = await encryptFile(file, encryptionKey)

        // Create form data with encrypted file and metadata
        const formData = new FormData()
        formData.append('file', encryptedFile, file.name)
        formData.append('document', JSON.stringify(document))

        // Export encryption key for storage
        const exportedKey = await window.crypto.subtle.exportKey('raw', encryptionKey)
        const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)))
        formData.append('encryptionKey', keyBase64)

        const response = await fetch('/api/external/upload', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error('Upload failed')
        }

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
