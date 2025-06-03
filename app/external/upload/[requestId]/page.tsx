'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'
import { useExternalRequest } from '../../../../features/external-requests/hooks/useExternalRequest'
import { DocumentUploader } from '../../../../features/external-requests/components/DocumentUploader'
import { Loader } from 'lucide-react'

export default function ExternalUploadPage({ params }: { params: { token: string } }) {
    const { request, isLoading, error } = useExternalRequest(params.token)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

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
                            {request.requestedDocuments.map((doc, index) => (
                                <li key={index} className="text-gray-700">
                                    {doc}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <DocumentUploader
                        token={params.token}
                        requiredDocuments={request.requestedDocuments}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
