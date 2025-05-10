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

    const DEMO_SECTION = [DOCUMENT_TYPES.IDENTITY_CARD, DOCUMENT_TYPES.PASSPORT];

    const DragAndDropDocumentInput = (documentType: DOCUMENT_TYPES) => {

        const documentSections = [
            { title: "Carte d'identité", type: DOCUMENT_TYPES.IDENTITY_CARD },
            { title: "Passeport", type: DOCUMENT_TYPES.PASSPORT },
            { title: "RIB: Relevé d'identité bancaire", type: DOCUMENT_TYPES.BANK_STATEMENT },
            { title: "Justificatif de domicile", type: DOCUMENT_TYPES.UTILITY_BILL },
            { title: "Permis de conduire", type: DOCUMENT_TYPES.DRIVERS_LICENSE },
        ];

        const sectionToDisplay = documentSections.find(section => section.type === documentType);

        if (!sectionToDisplay) {
            return;
        }

        return (
            <div className="space-y-8" key={documentType}>
                <h2 className="text-lg font-semibold mb-4">{sectionToDisplay.title}</h2>
                <SecureDocumentUpload
                    requestId={requestId}
                    documentType={sectionToDisplay.type}
                    onUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Upload Document</h1>

                <div className="space-y-8">
                    {DEMO_SECTION.map((documentType) => (
                        DragAndDropDocumentInput(documentType)
                    ))}
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