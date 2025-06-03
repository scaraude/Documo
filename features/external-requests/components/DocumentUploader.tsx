'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { ROUTES } from '@/shared/constants'
import { uploadDocument } from '../api/uploadDocument'

interface DocumentUploaderProps {
    token: string;
    requiredDocuments: string[];
}

interface UploadStatus {
    [key: string]: {
        progress: number;
        status: 'idle' | 'uploading' | 'completed' | 'error';
        error?: string;
        file?: File;
    }
}

export const DocumentUploader = ({ token, requiredDocuments }: DocumentUploaderProps) => {
    const router = useRouter();
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
        requiredDocuments.reduce((acc, doc) => ({
            ...acc,
            [doc]: { progress: 0, status: 'idle' }
        }), {})
    );

    const handleFileUpload = async (file: File, documentType: string) => {
        try {
            setUploadStatus(prev => ({
                ...prev,
                [documentType]: { progress: 0, status: 'uploading', file }
            }));

            await uploadDocument({
                file,
                documentType,
                token,
                onProgress: (progress) => {
                    setUploadStatus(prev => ({
                        ...prev,
                        [documentType]: { ...prev[documentType], progress }
                    }));
                }
            });

            setUploadStatus(prev => ({
                ...prev,
                [documentType]: { progress: 100, status: 'completed', file }
            }));

            // Check if all documents are uploaded
            const allCompleted = Object.values(uploadStatus).every(
                status => status.status === 'completed'
            );

            if (allCompleted) {
                router.push(ROUTES.EXTERNAL.UPLOAD_SUCCESS(token));
            }
        } catch (error) {
            setUploadStatus(prev => ({
                ...prev,
                [documentType]: {
                    progress: 0,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Upload failed',
                    file
                }
            }));
        }
    };

    return (
        <div className="space-y-6">
            {requiredDocuments.map((documentType) => {
                const status = uploadStatus[documentType];
                return (
                    <Card key={documentType} className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">{documentType}</h3>
                                <p className="text-sm text-gray-500">
                                    {status.status === 'idle' && 'En attente du document'}
                                    {status.status === 'uploading' && `Upload en cours ${status.progress}%`}
                                    {status.status === 'completed' && 'Document téléversé'}
                                    {status.status === 'error' && status.error}
                                </p>
                            </div>
                            <div>
                                {status.status !== 'completed' && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = '.pdf,.jpg,.jpeg,.png';
                                            input.onchange = (e) => {
                                                const file = (e.target as HTMLInputElement).files?.[0];
                                                if (file) {
                                                    handleFileUpload(file, documentType);
                                                }
                                            };
                                            input.click();
                                        }}
                                        disabled={status.status === 'uploading'}
                                    >
                                        {status.status === 'uploading' ? 'En cours...' : 'Choisir un fichier'}
                                    </Button>
                                )}
                            </div>
                        </div>
                        {status.status === 'uploading' && (
                            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${status.progress}%` }}
                                ></div>
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
};
