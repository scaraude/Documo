'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DOCUMENT_TYPES } from '@/shared/constants/documents/types';
import { DragAndDropDocumentInput, useDocumentUpload } from '@/features/documents';

export default function DocumentUploadPage() {
    const params = useParams();
    const requestId = params.requestId?.toString();
    const { getDocumentToFetchFromRequestId } = useDocumentUpload();
    const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [documentTypes, setDocumentTypes] = useState<DOCUMENT_TYPES[]>([]);

    useEffect(() => {
        if (!requestId) {
            setError('Request ID is required.');
            return;
        }
        const fetchDocumentTypes = async () => {
            try {
                const documentTypes = await getDocumentToFetchFromRequestId(requestId);
                setDocumentTypes(documentTypes);
                if (documentTypes.length === 0) {
                    setError('No document types found for this request ID.');
                }
            } catch (err) {
                setError('Failed to fetch document types.');
                console.error('Error fetching document types:', err);
            }
        };

        fetchDocumentTypes();
    }, [requestId, getDocumentToFetchFromRequestId]);


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
                    {documentTypes.map((documentType) => (
                        <DragAndDropDocumentInput
                            key={documentType}
                            documentType={documentType}
                            requestId={requestId}
                            onUploadComplete={handleUploadComplete}
                            onUploadError={handleUploadError}
                        />
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