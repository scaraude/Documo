'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentType, MAX_FILE_SIZE } from '@/shared/constants/documents/types';
import { useDocumentUpload } from '../hooks/useDocumentUpload';

interface SecureDocumentUploadProps {
    requestId: string;
    documentType: DocumentType;
    onUploadComplete: (documentId: string) => void;
    onUploadError: (error: Error) => void;
}

export function SecureDocumentUpload({
    requestId,
    documentType,
    onUploadComplete,
    onUploadError
}: Readonly<SecureDocumentUploadProps>) {
    const { secureUploadDocument, uploadProgress } = useDocumentUpload();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        console.log('Files dropped:', acceptedFiles);
        const file = acceptedFiles[0];
        if (!file) return;

        try {

            const document = await secureUploadDocument({
                requestId,
                file,
                type: documentType,
                onProgress: (progress) => {
                    console.log(`Upload progress: ${progress}%`);
                }
            });

            onUploadComplete(document.id);
        } catch (error) {
            onUploadError(error instanceof Error ? error : new Error('Upload failed'));
        }
    }, [requestId, documentType, secureUploadDocument, onUploadComplete, onUploadError]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxSize: MAX_FILE_SIZE,
        multiple: false
    });

    return (
        <div className="w-full">
            {uploadProgress ? (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress.progress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {uploadProgress.status === 'uploading' && 'Uploading...'}
                        {uploadProgress.status === 'validating' && 'Validating document...'}
                        {uploadProgress.status === 'complete' && 'Upload complete!'}
                        {uploadProgress.status === 'error' && `Error: ${uploadProgress.error}`}
                    </p>
                </div>
            )
                : (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p className="text-blue-500">Drop the file here...</p>
                        ) : (
                            <div>
                                <p className="text-gray-600">Drag and drop a file here, or click to select</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Supported formats: PDF, JPEG, PNG (max {MAX_FILE_SIZE / 1024 / 1024}MB)
                                </p>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
} 