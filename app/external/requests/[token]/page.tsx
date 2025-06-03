'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/shared/components/ui/card'
import { DocumentRequest } from '@/shared/types'
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '@/shared/mapper'
import { Badge } from '@/shared/components/ui/badge'
import { FileText, FileCheck } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { API_ROUTES } from '../../../../shared/constants'

export default function ExternalRequestPage() {
    const params = useParams()
    const token = params.token as string
    const [request, setRequest] = useState<DocumentRequest | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadRequest() {
            try {
                setIsLoading(true)
                const response = await fetch(API_ROUTES.EXTERNAL.REQUEST(token))
                if (!response.ok) {
                    throw new Error('Demande non trouvée')
                }
                const data = await response.json()
                setRequest(data)
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Erreur lors du chargement de la demande'))
            } finally {
                setIsLoading(false)
            }
        }

        if (token) {
            loadRequest()
        }
    }, [token])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <h1 className="text-2xl font-bold text-gray-800 mt-4">Chargement...</h1>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-800">Erreur</h1>
                    <p className="text-gray-600 mt-2">{error.message}</p>
                </div>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Demande non trouvée</h1>
                    <p className="text-gray-600 mt-2">La demande n&apos;existe pas ou a expiré.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-2xl w-full mx-auto p-6">
                <Card className="border-t-4 border-blue-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center mb-6">
                            <div className="rounded-full bg-blue-100 p-2 mr-3">
                                <FileText className="h-6 w-6 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Demande de documents</h2>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-gray-500 mb-1">Documents demandés</div>
                            <div className="space-y-2">
                                {request.requestedDocuments.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-5 w-5 text-gray-500" />
                                            <span className="text-gray-700 font-medium">
                                                {APP_DOCUMENT_TYPE_TO_LABEL_MAP[doc]}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            Requis
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <Button
                                onClick={() => {
                                    // Will handle FranceConnect authentication in TICKET-1
                                    window.location.href = `/api/auth/france-connect?requestId=${request.id}`
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <FileCheck className="h-5 w-5 mr-2" />
                                Continuer avec FranceConnect
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    // Will handle email authentication in TICKET-1
                                    window.location.href = `/api/auth/email?requestId=${request.id}`
                                }}
                            >
                                Continuer avec un email
                            </Button>
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Vos documents seront stockés de manière sécurisée et pourront être réutilisés
                            pour de futures demandes.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
