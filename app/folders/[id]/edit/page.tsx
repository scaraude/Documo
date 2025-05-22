// app/folders/[id]/edit/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useFolder } from '@/features/folders/hooks/useFolder';
import { FolderForm } from '@/features/folders/components/FolderForm';
import { UpdateFolderParams } from '@/features/folders/types';

export default function EditFolderPage() {
    const params = useParams();
    const folderId = params.id as string;
    const { currentFolder, loadFolder, updateFolder, isLoading } = useFolder();
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        async function fetchFolder() {
            try {
                await loadFolder(folderId);
                setIsInitialLoading(false);
            } catch {
                setError('Impossible de charger le dossier');
                setIsInitialLoading(false);
            }
        }

        if (folderId) {
            fetchFolder();
        }
    }, [folderId, loadFolder]);

    const handleSubmit = async (data: UpdateFolderParams) => {
        try {
            setError(null);
            await updateFolder(folderId, data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    if (isInitialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        );
    }

    if (!currentFolder && !isInitialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Dossier introuvable</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier le dossier</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-md">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6">
                {currentFolder && (
                    <FolderForm<UpdateFolderParams>
                        initialData={currentFolder}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
}