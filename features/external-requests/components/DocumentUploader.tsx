'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { uploadDocument } from '../api/uploadDocument'
import { toast } from "sonner"
import { Progress } from './Progress'

interface DocumentUploaderProps {
    requestId: string
    requiredDocuments: string[]
}

interface UploadStatus {
    [key: string]: {
        progress: number
        status: 'idle' | 'uploading' | 'completed' | 'error'
        error?: string
        file?: File
    }
}

export const DocumentUploader = ({ requestId, requiredDocuments }: DocumentUploaderProps) => {
    const router = useRouter()
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
        requiredDocuments.reduce((acc, doc) => ({
            ...acc,
            [doc]: { progress: 0, status: 'idle' }
        }), {})
    )

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        maxSize: 10485760, // 10MB
    })

    const handleDrop = async (files: File[], documentType: string) => {
        if (files.length === 0) return

        const file = files[0]
        setUploadStatus(prev => ({
            ...prev,
            [documentType]: { progress: 0, status: 'uploading', file }
        }))

        try {
            await uploadDocument({
                file,
                documentType,
                requestId,
                onProgress: (progress) => {
                    setUploadStatus(prev => ({
                        ...prev,
                        [documentType]: { ...prev[documentType], progress }
                    }))
                }
            })

            setUploadStatus(prev => ({
                ...prev,
                [documentType]: { ...prev[documentType], status: 'completed', progress: 100 }
            }))

            toast("Document téléchargé", {
                description: "Votre document a été téléchargé et chiffré avec succès.",
            })

            // Check if all documents are uploaded
            const allCompleted = Object.values(uploadStatus).every(
                status => status.status === 'completed'
            )
            if (allCompleted) {
                router.push(`/external/upload/${requestId}/success`)
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Une erreur s'est produite lors du téléchargement"
            setUploadStatus(prev => ({
                ...prev,
                [documentType]: {
                    ...prev[documentType],
                    status: 'error',
                    error: errorMessage
                }
            }))

            toast.error("Erreur de téléchargement", {
                description: errorMessage,
            })
        }
    }

    return (
        <div className="space-y-6">
            {requiredDocuments.map((docType) => (
                <Card key={docType} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">{docType}</h3>
                        {uploadStatus[docType].status === 'completed' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {uploadStatus[docType].status === 'error' && (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                    </div>

                    {uploadStatus[docType].status === 'idle' ? (
                        <div
                            {...getRootProps()}
                            onClick={(e) => e.stopPropagation()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        >
                            <input {...getInputProps()} accept="image/*,.pdf" onChange={(e) => {
                                if (e.target.files?.length) {
                                    handleDrop([e.target.files[0]], docType)
                                }
                            }} />
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                                Glissez un fichier ici ou cliquez pour sélectionner
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PDF, PNG ou JPG jusqu&apos;à 10MB
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {uploadStatus[docType].file && (
                                <p className="text-sm text-gray-600">
                                    {uploadStatus[docType].file.name}
                                </p>
                            )}
                            <Progress
                                value={uploadStatus[docType].progress}
                                className="w-full"
                            />
                            {uploadStatus[docType].error && (
                                <p className="text-sm text-red-500">
                                    {uploadStatus[docType].error}
                                </p>
                            )}
                            {uploadStatus[docType].status === 'error' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setUploadStatus(prev => ({
                                            ...prev,
                                            [docType]: { progress: 0, status: 'idle' }
                                        }))
                                    }}
                                >
                                    Réessayer
                                </Button>
                            )}
                        </div>
                    )}
                </Card>
            ))}
        </div>
    )
}
