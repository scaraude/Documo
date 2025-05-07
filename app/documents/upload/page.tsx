'use client';

import { useState } from 'react';
import { SecureDocumentUpload } from '@/features/documents/components/SecureDocumentUpload';
import { DOCUMENT_TYPES } from '@/shared/constants/documents/types';

export default function DocumentUploadPage() {
    const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUploadComplete = (documentId: string) => {
        setUploadedDocumentId(documentId);
        setError(null);
    };

    const handleUploadError = (error: Error) => {
        setError(error.message);
        setUploadedDocumentId(null);
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Upload Document</h1>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Identity Card</h2>
                        <SecureDocumentUpload
                            requestId="test-request"
                            documentType={DOCUMENT_TYPES.IDENTITY_CARD}
                            onUploadComplete={handleUploadComplete}
                            onUploadError={handleUploadError}
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Passport</h2>
                        <SecureDocumentUpload
                            requestId="test-request"
                            documentType={DOCUMENT_TYPES.PASSPORT}
                            onUploadComplete={handleUploadComplete}
                            onUploadError={handleUploadError}
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Utility Bill</h2>
                        <SecureDocumentUpload
                            requestId="test-request"
                            documentType={DOCUMENT_TYPES.UTILITY_BILL}
                            onUploadComplete={handleUploadComplete}
                            onUploadError={handleUploadError}
                        />
                    </div>
                </div>

                {uploadedDocumentId && (
                    <div className="mt-8 p-4 bg-green-50 text-green-700 rounded-lg">
                        Document uploaded successfully! ID: {uploadedDocumentId}
                    </div>
                )}

                {error && (
                    <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
                        Error: {error}
                    </div>
                )}
            </div>
        </div>
    );
} 