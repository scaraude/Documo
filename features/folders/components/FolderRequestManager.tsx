'use client'
import { useState } from 'react';
import { FolderWithRelationsAndStatus } from '../types';
import { useRequests } from '@/features/requests/hooks/useRequests';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/components';
import { Plus, Send, Users, Clock, CheckCircle, XCircle, FileCheck, Hash, Calendar, Trash2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ComputedRequestStatus, DocumentRequestWithStatue } from '@/shared/types';
import Link from 'next/link';
import { ROUTES } from '../../../shared/constants';
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '../../../shared/mapper';

interface FolderRequestManagerProps {
    folder: FolderWithRelationsAndStatus;
    onRemoveRequest: (folderId: string, requestId: string) => Promise<void>;
}

export const FolderRequestManager = ({ folder, onRemoveRequest }: FolderRequestManagerProps) => {
    const { createRequestMutation } = useRequests();
    const [isCreatingRequest, setIsCreatingRequest] = useState(false);
    const [newCivilIds, setNewCivilIds] = useState<string[]>(['']);
    const [isLoading, setIsLoading] = useState(false);

    const addCivilId = () => {
        setNewCivilIds(prev => [...prev, '']);
    };

    const removeCivilId = (index: number) => {
        setNewCivilIds(prev => prev.filter((_, i) => i !== index));
    };

    const updateCivilId = (index: number, value: string) => {
        setNewCivilIds(prev => prev.map((id, i) => i === index ? value : id));
    };

    const handleCreateRequests = async () => {
        const validCivilIds = newCivilIds.filter(id => id.trim() !== '');

        if (validCivilIds.length === 0) return;

        try {
            setIsLoading(true);

            await Promise.all(
                validCivilIds.map(civilId =>
                    createRequestMutation.mutateAsync(
                        {
                            civilId: civilId.trim(),
                            requestedDocuments: folder.requestedDocuments,
                            folderId: folder.id,
                        }
                    )
                )
            );

            // Reset form
            setNewCivilIds(['']);
            setIsCreatingRequest(false);
        } catch (error) {
            console.error('Error creating requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: ComputedRequestStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'ACCEPTED': return 'bg-green-50 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
            case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: ComputedRequestStatus) => {
        switch (status) {
            case 'PENDING': return <Clock className="h-4 w-4" />;
            case 'ACCEPTED': return <CheckCircle className="h-4 w-4" />;
            case 'REJECTED': return <XCircle className="h-4 w-4" />;
            case 'COMPLETED': return <FileCheck className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusLabel = (status: ComputedRequestStatus) => {
        switch (status) {
            case 'PENDING': return 'En attente';
            case 'ACCEPTED': return 'Acceptée';
            case 'REJECTED': return 'Refusée';
            case 'COMPLETED': return 'Terminée';
            default: return status;
        }
    };

    const formatRelativeTime = (date: Date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
    };

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Demandes de documents
                    </h3>
                    <p className="text-sm text-gray-600">
                        {folder.requests?.length || 0} demande{(folder.requests?.length || 0) > 1 ? 's' : ''} envoyée{(folder.requests?.length || 0) > 1 ? 's' : ''}
                    </p>
                </div>
                {!isCreatingRequest && (
                    <Button onClick={() => setIsCreatingRequest(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle demande
                    </Button>
                )}
            </div>

            {/* Create New Request Form */}
            {isCreatingRequest && (
                <Card className="border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Send className="h-5 w-5 mr-2 text-blue-600" />
                            Envoyer de nouvelles demandes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md">
                            <h4 className="font-medium text-blue-900 mb-2">Documents qui seront demandés :</h4>
                            <div className="flex flex-wrap gap-2">
                                {folder.requestedDocuments.map((doc, index) => (
                                    <Badge key={index} variant="outline" className="text-blue-700 border-blue-300">
                                        {APP_DOCUMENT_TYPE_TO_LABEL_MAP[doc]}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ID civils des personnes concernées
                            </label>
                            <div className="space-y-3">
                                {newCivilIds.map((civilId, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={civilId}
                                            onChange={(e) => updateCivilId(index, e.target.value)}
                                            placeholder="ID civil (ex: 123456789)"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {newCivilIds.length > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeCivilId(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" size="sm" onClick={addCivilId} className="mt-2">
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter une personne
                            </Button>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setIsCreatingRequest(false)}>
                                Annuler
                            </Button>
                            <Button onClick={handleCreateRequests} disabled={isLoading}>
                                {isLoading ? 'Envoi...' : 'Envoyer les demandes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Existing Requests */}
            {(!folder.requests || folder.requests.length === 0) ? (
                !isCreatingRequest && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucune demande envoyée
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Commencez par envoyer des demandes de documents aux personnes concernées
                            </p>
                            <Button onClick={() => setIsCreatingRequest(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Première demande
                            </Button>
                        </CardContent>
                    </Card>
                )
            ) : (
                <div className="space-y-3">
                    {folder.requests.map((request) => (
                        <RequestCard
                            key={request.id}
                            request={request}
                            folderId={folder.id}
                            onRemoveRequest={onRemoveRequest}
                            getStatusColor={getStatusColor}
                            getStatusIcon={getStatusIcon}
                            getStatusLabel={getStatusLabel}
                            formatRelativeTime={formatRelativeTime}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface RequestCardProps {
    request: DocumentRequestWithStatue;
    folderId: string;
    onRemoveRequest: (folderId: string, requestId: string) => Promise<void>;
    getStatusColor: (status: ComputedRequestStatus) => string;
    getStatusIcon: (status: ComputedRequestStatus) => React.ReactNode;
    getStatusLabel: (status: ComputedRequestStatus) => string;
    formatRelativeTime: (date: Date) => string;
}

const RequestCard = ({
    request,
    folderId,
    onRemoveRequest,
    getStatusColor,
    getStatusIcon,
    getStatusLabel,
    formatRelativeTime
}: RequestCardProps) => {

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span className="font-mono text-sm font-medium text-gray-900">
                                {request.civilId}
                            </span>
                        </div>

                        <Badge className={`px-3 py-1 text-xs font-medium border ${getStatusColor(request.status)}`}>
                            <span className="flex items-center gap-1">
                                {getStatusIcon(request.status)}
                                {getStatusLabel(request.status)}
                            </span>
                        </Badge>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{formatRelativeTime(request.createdAt)}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link href={ROUTES.REQUESTS.DETAIL(request.id)}>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRemoveRequest(folderId, request.id)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};