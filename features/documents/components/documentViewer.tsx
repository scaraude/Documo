'use client'
import { useEffect } from 'react'
import { AppDocument } from '@/shared/types'
import { Dialog, DialogContent, DialogTitle } from '../../../shared/components/ui/dialog'
import { ScrollArea } from '../../../shared/components/ui/scroll-area'
import { Button } from '../../../shared/components/ui/button'
import { Loader2, Download } from 'lucide-react'
import Image from 'next/image'
import { useDecryptedDocument } from '../hooks/useDecryptedDocument'

interface DocumentViewerProps {
    document: AppDocument
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DocumentViewer({ document, open, onOpenChange }: DocumentViewerProps) {
    const { objectUrl, isLoading, error, decryptDocument } = useDecryptedDocument(document)

    // Only decrypt when dialog is open
    useEffect(() => {
        if (open && document.url && !objectUrl && !isLoading) {
            decryptDocument()
        }
    }, [open, document.url, objectUrl, isLoading, decryptDocument])

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
                    <Button onClick={decryptDocument} className="mt-4">
                        Retry
                    </Button>
                </div>
            )
        }

        if (!objectUrl) {
            return null
        }

        if (document.mimeType.startsWith('image/')) {
            return (
                <Image
                    src={objectUrl}
                    alt={document.fileName}
                    className="max-w-full h-auto"
                    width={800}
                    height={600}
                />
            )
        }

        if (document.mimeType === 'application/pdf') {
            return (
                <iframe
                    src={objectUrl}
                    className="w-full h-[calc(100vh-200px)] min-h-[500px]"
                    title={document.fileName}
                />
            )
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-sm text-gray-600 mb-4">
                    Preview not available for this file type
                </p>
                <Button asChild>
                    <a href={objectUrl} download={document.fileName}>
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
