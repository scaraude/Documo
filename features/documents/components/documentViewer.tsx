import { useState, useEffect, useCallback } from 'react'
import { AppDocument } from '@/shared/types'
import { Dialog, DialogContent, DialogTitle } from '../../../shared/components/ui/dialog'
import { ScrollArea } from '../../../shared/components/ui/scroll-area'
import { Button } from '../../../shared/components/ui/button'
import { Loader2, Download } from 'lucide-react'
import Image from 'next/image'
import { decryptBlob, importEncryptionKey } from '../utils/encryption'

interface DocumentViewerProps {
    document: AppDocument
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DocumentViewer({ document, open, onOpenChange }: DocumentViewerProps) {
    const [objectUrl, setObjectUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Cleanup object URL on unmount or when document changes
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
            }
        }
    }, [objectUrl])

    const decryptAndViewDocument = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            // Fetch the encrypted file
            const response = await fetch(document.url!)
            const encryptedBlob = await response.blob()

            // Import the DEK (Document Encryption Key)
            const key = await importEncryptionKey(document.dek)

            // Create a new blob with the decrypted data
            const decryptedBlob = await decryptBlob(encryptedBlob, key, document.metadata.mimeType)
            const url = URL.createObjectURL(decryptedBlob)
            setObjectUrl(url)
        } catch (err) {
            console.error('Failed to decrypt document:', err)
            setError('Failed to decrypt document. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [document.url, document.dek, document.metadata.mimeType])

    useEffect(() => {
        if (open && document.url && !objectUrl && !isLoading) {
            decryptAndViewDocument()
        }
    }, [open, document.url, objectUrl, isLoading, decryptAndViewDocument])

    function renderContent() {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Decrypting document...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <p className="text-red-500">{error}</p>
                    <Button onClick={decryptAndViewDocument} className="mt-4">
                        Retry
                    </Button>
                </div>
            )
        }

        if (!objectUrl) {
            return null
        }

        if (document.metadata.mimeType.startsWith('image/')) {
            return (
                <Image
                    src={objectUrl}
                    alt={document.metadata.name}
                    className="max-w-full h-auto"
                    width={800}
                    height={600}
                />
            )
        }

        if (document.metadata.mimeType === 'application/pdf') {
            return (
                <iframe
                    src={objectUrl}
                    className="w-full h-[calc(100vh-200px)] min-h-[500px]"
                    title={document.metadata.name}
                />
            )
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-sm text-gray-600 mb-4">
                    Preview not available for this file type
                </p>
                <Button asChild>
                    <a href={objectUrl} download={document.metadata.name}>
                        <Download className="mr-2 h-4 w-4" />
                        Download File
                    </a>
                </Button>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle />
            <DialogContent className="max-w-4xl w-[90vw]">
                <ScrollArea className="max-h-[calc(100vh-100px)]">
                    {renderContent()}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
