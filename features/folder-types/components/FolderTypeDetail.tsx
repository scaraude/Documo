'use client'
import { useState } from 'react';
import Link from 'next/link';
import { FolderType } from '../types';
import { ROUTES } from '@/shared/constants';
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '@/shared/mapper';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components';
import { FolderOpen, FileText, Plus, Trash2, Settings, Calendar } from 'lucide-react';

interface FolderTypeDetailProps {
    folderType: FolderType;
    onDelete: (id: string) => Promise<void>;
}

export const FolderTypeDetail = ({ folderType, onDelete }: FolderTypeDetailProps) => {
    const [activeTab, setActiveTab] = useState<'info' | 'usage'>('info');

    const handleDelete = async () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le type de dossier "${folderType.name}" ? Cette action est irréversible.`)) {
            await onDelete(folderType.id);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                            <FolderOpen className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{folderType.name}</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Créé le {formatDate(folderType.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <Button asChild>
                            <Link href={`${ROUTES.FOLDERS.NEW}?typeId=${folderType.id}`}>
                                <Plus className="h-4 w-4 mr-2" />
                                Créer un dossier
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-200">
                    <div className="flex px-4 py-3 bg-gray-50 border-b">
                        <button
                            className={`px-4 py-2 font-medium text-sm rounded-md mr-2 ${activeTab === 'info'
                                ? 'bg-white shadow text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('info')}
                        >
                            <Settings className="h-4 w-4 inline mr-2" />
                            Informations
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm rounded-md ${activeTab === 'usage'
                                ? 'bg-white shadow text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('usage')}
                        >
                            <Calendar className="h-4 w-4 inline mr-2" />
                            Utilisation
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {activeTab === 'info' && (
                    <>
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {folderType.description ? (
                                        <p className="text-gray-700">{folderType.description}</p>
                                    ) : (
                                        <p className="text-gray-500 italic">Aucune description fournie</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2" />
                                    Documents requis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {folderType.requiredDocuments.map((doc, index) => (
                                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                            <span className="text-sm font-medium">
                                                {APP_DOCUMENT_TYPE_TO_LABEL_MAP[doc]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {activeTab === 'usage' && (
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistiques d&apos;utilisation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Statistiques à venir
                                    </h3>
                                    <p className="text-gray-500">
                                        Les statistiques d&apos;utilisation seront disponibles prochainement
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Button asChild>
                            <Link href={`${ROUTES.FOLDERS.NEW}?typeId=${folderType.id}`}>
                                <Plus className="h-4 w-4 mr-2" />
                                Créer un nouveau dossier
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={ROUTES.FOLDERS.HOME}>
                                <FolderOpen className="h-4 w-4 mr-2" />
                                Voir tous les dossiers
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};