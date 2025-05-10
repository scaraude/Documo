'use client';

import { useState } from 'react';
import { SecureDocumentUpload } from '@/features/documents/components/SecureDocumentUpload';
import { DOCUMENT_TYPES } from '@/shared/constants/documents/types';
import { useParams } from 'next/navigation';

export default function DocumentUploadPage() {
    const params = useParams();
    const requestId = params.requestId?.toString();
    const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!requestId) {
        return <div>Error: Request ID is required.</div>;
    }

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
                        <h2 className="text-lg font-semibold mb-4">Carte d&apos;identité</h2>
                        <SecureDocumentUpload
                            requestId={requestId}
                            documentType={DOCUMENT_TYPES.IDENTITY_CARD}
                            onUploadComplete={handleUploadComplete}
                            onUploadError={handleUploadError}
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Passeport</h2>
                        <SecureDocumentUpload
                            requestId={requestId}
                            documentType={DOCUMENT_TYPES.PASSPORT}
                            onUploadComplete={handleUploadComplete}
                            onUploadError={handleUploadError}
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">RIB: Relevé d&apos;identité bancaire</h2>
                        <SecureDocumentUpload
                            requestId={requestId}
                            documentType={DOCUMENT_TYPES.BANK_STATEMENT}
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