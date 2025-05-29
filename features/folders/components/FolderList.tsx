// features/folders/components/FolderList.tsx
'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComputedFolderStatus, Folder } from '../types';
import { ROUTES } from '@/shared/constants';
import { useFolderStatus } from '../../../shared/hooks/useComputedStatus';

interface FolderListProps {
    folders: Array<Folder & { requestsCount?: number }>;
    onDelete: (id: string) => Promise<void>;
}

export const FolderList: React.FC<FolderListProps> = ({ folders, onDelete }) => {
    const router = useRouter();
    const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
            await onDelete(id);
        }
    };

    const getFolderStatusText = (status: ComputedFolderStatus) => {
        switch (status) {
            case "ACTIVE": return 'Actif';
            case "ARCHIVED": return 'Archivé';
            case "COMPLETED": return 'Complété';
            case "PENDING": return 'En attente';
            default:
                const never: never = status;
                return never;
        }
    };

    const getFolderStatusClass = (status: ComputedFolderStatus) => {
        switch (status) {
            case "ACTIVE": return 'bg-green-100 text-green-800';
            case "ARCHIVED": return 'bg-gray-100 text-gray-800';
            case "COMPLETED": return 'bg-blue-100 text-blue-800';
            case "PENDING": return 'bg-yellow-100 text-yellow-800';
            default:
                const never: never = status;
                return never;
        }
    };

    const handleFolderClick = (folderId: string) => {
        router.push(`${ROUTES.FOLDERS.DETAIL(folderId)}`);
    };

    const toggleExpand = (e: React.MouseEvent, folderId: string) => {
        e.stopPropagation();
        setExpandedFolderId(prevId => prevId === folderId ? null : folderId);
    };

    if (folders.length === 0) {
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900">Aucun dossier</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Commencez par créer un nouveau dossier
                </p>
                <div className="mt-6">
                    <Link href={ROUTES.FOLDERS.NEW}>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg
                                className="-ml-1 mr-2 h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Nouveau dossier
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const FolderItem = ({ folder }: { folder: Folder & { requestsCount?: number } }) => {
        const folderStatus = useFolderStatus(folder);

        return <div
            className="bg-white shadow overflow-hidden sm:rounded-md cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleFolderClick(folder.id)}
        >
            <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{folder.name}</h3>
                    <div className="mt-2 flex items-center">
                        <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFolderStatusClass(
                                folderStatus
                            )}`}
                        >
                            {getFolderStatusText(folderStatus)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                            {folder.requestsCount !== undefined ? `${folder.requestsCount} demande(s)` : ""}
                        </span>
                        {folder.expiresAt && (
                            <span className="ml-2 text-sm text-gray-500">
                                • Expire le {new Date(folder.expiresAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                    {folder.description && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{folder.description}</p>
                    )}
                </div>
                <div className="flex items-center">
                    <button
                        onClick={(e) => toggleExpand(e, folder.id)}
                        className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            {expandedFolderId === folder.id ? (
                                <path
                                    fillRule="evenodd"
                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            ) : (
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {expandedFolderId === folder.id && (
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50 flex justify-between">
                    <div className="text-sm">
                        <p className="font-medium text-gray-500">Documents requis:</p>
                        <ul className="mt-1 list-disc list-inside text-gray-600">
                            {folder.requestedDocuments.map((doc, index) => (
                                <li key={index}>{doc}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex space-x-2">
                        <Link href={ROUTES.FOLDERS.EDIT(folder.id)}>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Modifier
                            </button>
                        </Link>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(folder.id);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            )}
        </div>
    }

    return (
        <div className="space-y-4">
            {folders.map((folder) => (
                <FolderItem key={folder.id} folder={folder} />
            ))}
        </div>
    );
};