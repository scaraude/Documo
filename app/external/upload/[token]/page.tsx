'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'
import { useExternalRequest } from '../../../../features/external-requests/hooks/useExternalRequest'
import { DocumentUploader } from '../../../../features/external-requests/components/DocumentUploader'
import { Loader } from 'lucide-react'
import * as React from 'react'
import { useParams } from 'next/navigation';
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '../../../../shared/mapper'
import { useDocument } from '@/features/documents/hooks/useDocument'
import { AppDocumentType } from '../../../../shared/constants'

export default function ExternalUploadPage() {
    const { token }: { token: string } = useParams();
    const { getRequestByToken } = useExternalRequest();
    const { getDocumentsByRequestId } = useDocument();
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [documentTypesMissing, setDocumentTypesMissing] = useState<AppDocumentType[]>([]);
    const { data: request, isLoading, error } = getRequestByToken(token)
    const { data: documents } = getDocumentsByRequestId(request?.id);


    useEffect(() => {
        if (request) {
            const documentTypeMissing = documents ? request.requestedDocuments.filter(
                (doc) => !documents.some((d) => d.type === doc)
            ) : request.requestedDocuments;
            setDocumentTypesMissing(documentTypeMissing);
        }
    }, [request, documents]);


    useEffect(() => {
        // Check if user is authenticated via FranceConnect or email
        // This will be implemented in ticket 5
        const checkAuth = async () => {
            // Temporary mock
            setIsAuthenticated(true)
        }
        checkAuth()
    }, [])


    if (isLoading) {
        return (
            <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        )
    }

    if (!request) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Demande non trouvée</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-600">
                            Aucune demande trouvée pour ce token. Veuillez vérifier le lien ou contacter le support.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error || !request) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Erreur</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-600">
                            Cette demande n&apos;existe pas ou a expiré.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Authentification requise</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Veuillez vous authentifier pour accéder à cette page.</p>
                        {/* Authentication components will be added in ticket 5 */}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Envoi de documents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Documents demandés :</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {request.requestedDocuments.map((requestedDocument, index) => (
                                <li key={index} className="text-gray-700">
                                    {documentTypesMissing.includes(requestedDocument) ? '⏳  ' : '✅  '}
                                    {APP_DOCUMENT_TYPE_TO_LABEL_MAP[requestedDocument]}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <DocumentUploader
                        token={token}
                        documentTypesMissing={documentTypesMissing}
                        setDocumentTypeMissing={setDocumentTypesMissing}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
