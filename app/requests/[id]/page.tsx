'use client'

import { useRequest } from '@/features/requests'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { DOCUMENT_VALIDATION_RULES } from '@/shared/constants'
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '@/shared/mapper'
import { ComputedRequestStatus, DocumentRequest } from '@/shared/types'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CheckCircle, Clock, FileCheck, FileText, History, XCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RequestDetailPage() {
    const params = useParams()
    const { requests, isLoaded, error } = useRequest()
    const [request, setRequest] = useState<DocumentRequest | null>(null)

    useEffect(() => {
        if (isLoaded && params.id) {
            const foundRequest = requests.find(r => r.id === params.id)
            setRequest(foundRequest || null)
        }
    }, [isLoaded, params.id, requests])

    const getRequestStatus = (request: DocumentRequest): ComputedRequestStatus => {
        if (request.completedAt) return 'COMPLETED'
        if (request.rejectedAt) return 'REJECTED'
        if (request.acceptedAt) return 'ACCEPTED'
        return 'PENDING'
    }

    const getStatusColor = (status: ComputedRequestStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
            case 'ACCEPTED': return 'bg-green-50 text-green-700 border-green-200'
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200'
            case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-200'
            default: return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    const getStatusLabel = (status: ComputedRequestStatus) => {
        switch (status) {
            case 'PENDING': return 'En attente'
            case 'ACCEPTED': return 'Acceptée'
            case 'REJECTED': return 'Refusée'
            case 'COMPLETED': return 'Terminée'
            default: return status
        }
    }

    const formatRelativeTime = (date: Date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
    }

    const formatDateTime = (date: Date) => {
        return format(new Date(date), "d MMMM yyyy 'à' HH:mm", { locale: fr })
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error || !request) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Erreur: La demande n&apos;a pas été trouvée</p>
            </div>
        )
    }

    const status = getRequestStatus(request)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Demande #{request.civilId}
                                </h1>
                                <Badge className={`px-3 py-1 text-sm font-medium border ${getStatusColor(status)}`}>
                                    {getStatusLabel(status)}
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                                Créée {formatRelativeTime(request.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="history">Historique</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Request Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Détails de la demande
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="text-gray-600">ID Civil</div>
                                        <div className="font-medium">{request.civilId}</div>
                                        <div className="text-gray-600">Statut</div>
                                        <div>
                                            <Badge className={`px-2 py-0.5 text-xs font-medium border ${getStatusColor(status)}`}>
                                                {getStatusLabel(status)}
                                            </Badge>
                                        </div>
                                        <div className="text-gray-600">Créée le</div>
                                        <div className="font-medium">{formatDateTime(request.createdAt)}</div>
                                        <div className="text-gray-600">Expire le</div>
                                        <div className="font-medium">{formatDateTime(request.expiresAt)}</div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center">
                                        <History className="h-4 w-4 mr-2" />
                                        Chronologie
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <Clock className="h-5 w-5 text-yellow-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Demande créée</p>
                                                <p className="text-xs text-gray-500">{formatDateTime(request.createdAt)}</p>
                                            </div>
                                        </div>
                                        {request.acceptedAt && (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Demande acceptée</p>
                                                    <p className="text-xs text-gray-500">{formatDateTime(request.acceptedAt)}</p>
                                                </div>
                                            </div>
                                        )}
                                        {request.rejectedAt && (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Demande refusée</p>
                                                    <p className="text-xs text-gray-500">{formatDateTime(request.rejectedAt)}</p>
                                                </div>
                                            </div>
                                        )}
                                        {request.completedAt && (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <FileCheck className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Demande complétée</p>
                                                    <p className="text-xs text-gray-500">{formatDateTime(request.completedAt)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="documents">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Documents requis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {request.requestedDocuments.map((documentType) => (
                                        <div key={documentType} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-gray-600" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{APP_DOCUMENT_TYPE_TO_LABEL_MAP[documentType]}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Format: {DOCUMENT_VALIDATION_RULES[documentType].allowedTypes
                                                            .map(type => type.split('/')[1].toUpperCase())
                                                            .join(', ')}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Max {DOCUMENT_VALIDATION_RULES[documentType].maxSize / 1024 / 1024}MB
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center">
                                    <History className="h-4 w-4 mr-2" />
                                    Historique des modifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Add history items here when you have the data */}
                                    <p className="text-sm text-gray-600">Aucun historique disponible</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
