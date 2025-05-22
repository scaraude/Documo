// features/folders/components/FolderDetail.tsx
'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FolderStatus } from '@/shared/constants';
import { ROUTES, FOLDER_STATUS } from '@/shared/constants';
import { FolderWithRelations } from '../types';

interface FolderDetailProps {
    folder: FolderWithRelations;
    onDelete: (id: string) => Promise<void>;
    onRemoveRequest: (folderId: string, requestId: string) => Promise<void>;
}

export const FolderDetail: React.FC<FolderDetailProps> = ({
    folder,
    onDelete,
    onRemoveRequest
}) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'info' | 'requests' | 'documents'>('info');

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
            await onDelete(folder.id);
            router.push(ROUTES.FOLDERS.HOME);
        }
    };

    const getFolderStatusText = (status: FolderStatus) => {
        switch (status) {
            case FOLDER_STATUS.ACTIVE: return 'Actif';
            case FOLDER_STATUS.ARCHIVED: return 'Archivé';
            case FOLDER_STATUS.COMPLETED: return 'Complété';
            case FOLDER_STATUS.PENDING: return 'En attente';
            default: return status;
        }
    };

    const getFolderStatusClass = (status: FolderStatus) => {
        switch (status) {
            case FOLDER_STATUS.ACTIVE: return 'bg-green-100 text-green-800';
            case FOLDER_STATUS.ARCHIVED: return 'bg-gray-100 text-gray-800';
            case FOLDER_STATUS.COMPLETED: return 'bg-blue-100 text-blue-800';
            case FOLDER_STATUS.PENDING: return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRequestStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'En attente';
            case 'ACCEPTED': return 'Accepté';
            case 'REJECTED': return 'Refusé';
            case 'COMPLETED': return 'Complété';
            default: return status;
        }
    };

    const getRequestStatusClass = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{folder.name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Créé le {formatDate(folder.createdAt)}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Link
                        href={`${ROUTES.REQUESTS.NEW}?folderId=${folder.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Nouvelle demande
                    </Link>
                    <Link href={ROUTES.FOLDERS.EDIT(folder.id)}>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Modifier
                        </button>
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            <div className="border-t border-gray-200">
                <div className="flex px-4 py-3 bg-gray-50 border-b">
                    <button
                        className={`px-4 py-2 font-medium text-sm rounded-md mr-2 ${activeTab === 'info'
                            ? 'bg-white shadow text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('info')}
                    >
                        Informations
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm rounded-md mr-2 ${activeTab === 'requests'
                            ? 'bg-white shadow text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('requests')}
                    >
                        Demandes
                        {folder.requests && folder.requests.length > 0 && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200">
                                {folder.requests.length}
                            </span>
                        )}
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm rounded-md ${activeTab === 'documents'
                            ? 'bg-white shadow text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('documents')}
                    >
                        Documents
                        {folder.documents && folder.documents.length > 0 && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200">
                                {folder.documents.length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === 'info' && (
                    <dl className="divide-y divide-gray-200">
                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Statut</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFolderStatusClass(
                                        folder.status
                                    )}`}
                                >
                                    {getFolderStatusText(folder.status)}
                                </span>
                            </dd>
                        </div>
                        {folder.description && (
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {folder.description}
                                </dd>
                            </div>
                        )}
                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Documents requis</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {folder.requestedDocuments.map((doc, index) => (
                                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                            <div className="w-0 flex-1 flex items-center">
                                                <svg
                                                    className="flex-shrink-0 h-5 w-5 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="ml-2 flex-1 w-0 truncate">{doc}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                        {folder.expiresAt && (
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Date d&apos;expiration</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {formatDate(folder.expiresAt)}
                                </dd>
                            </div>
                        )}
                    </dl>
                )}

                {activeTab === 'requests' && (
                    <div className="overflow-x-auto">
                        {!folder.requests || folder.requests.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-500">Aucune demande pour ce dossier</p>
                                <Link
                                    href={`${ROUTES.REQUESTS.NEW}?folderId=${folder.id}`}
                                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Créer une demande
                                </Link>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Statut
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Date de création
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Expiration
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {folder.requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{request.civilId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRequestStatusClass(
                                                        request.status
                                                    )}`}
                                                >
                                                    {getRequestStatusText(request.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(request.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(request.expiresAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={ROUTES.REQUESTS.DETAIL(request.id)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Voir
                                                </Link>
                                                <button
                                                    onClick={() => onRemoveRequest(folder.id, request.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Retirer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="overflow-hidden">
                        {!folder.documents || folder.documents.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-500">Aucun document dans ce dossier</p>
                                {folder.requests && folder.requests.length > 0 && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Créez une demande ou attendez que les documents soient téléchargés
                                    </p>
                                )}
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {folder.documents.map((document) => (
                                    <li key={document.id} className="px-4 py-4 flex items-center hover:bg-gray-50">
                                        <div className="min-w-0 flex-1 flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-10 w-10 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="min-w-0 flex-1 px-4">
                                                <div>
                                                    <p className="text-sm font-medium text-blue-600 truncate">
                                                        {document.metadata.name}
                                                    </p>
                                                    <p className="mt-1 flex items-center text-sm text-gray-500">
                                                        <span className="truncate">{document.type}</span>
                                                        <span className="ml-1.5 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                                            {document.status}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Link
                                                href={`/documents/${document.id}`}
                                                className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Voir
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}