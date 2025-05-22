// app/folders/page.tsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFolder } from '@/features/folders/hooks/useFolder';
import { FolderList } from '@/features/folders/components/FolderList';
import { ROUTES } from '@/shared/constants';

export default function FoldersPage() {
    const { folders, isLoaded, isLoading, error, loadFolders, deleteFolder } = useFolder();
    const [showStats, setShowStats] = useState(true);

    useEffect(() => {
        loadFolders(showStats);
    }, [loadFolders, showStats]);

    if (isLoading && !isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Erreur: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dossiers</h1>
                <Link href={ROUTES.FOLDERS.NEW}>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
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
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Nouveau dossier
                    </button>
                </Link>
            </div>

            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => {
                        setShowStats(!showStats);
                        loadFolders(!showStats);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    {showStats ? 'Masquer les statistiques' : 'Afficher les statistiques'}
                </button>
            </div>

            <FolderList folders={folders} onDelete={deleteFolder} />
        </div>
    );
}