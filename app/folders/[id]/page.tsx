// app/folders/[id]/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFolder } from '@/features/folders/hooks/useFolder';
import { FolderDetail } from '@/features/folders/components/FolderDetail';
import { ROUTES } from '@/shared/constants';

export default function FolderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const folderId = params.id as string;
    const { currentFolder, loadFolder, deleteFolder, removeRequestFromFolder, isLoading } = useFolder();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFolder() {
            try {
                setError(null);
                await loadFolder(folderId, true); // Include relations
            } catch {
                setError('Impossible de charger le dossier');
            }
        }

        if (folderId) {
            fetchFolder();
        }
    }, [folderId, loadFolder]);

    const handleDelete = async (id: string) => {
        try {
            await deleteFolder(id);
            router.push(ROUTES.FOLDERS.HOME);
        } catch {
            setError('Impossible de supprimer le dossier');
        }
    };

    const handleRemoveRequest = async (folderId: string, requestId: string) => {
        try {
            await removeRequestFromFolder(folderId, requestId);
        } catch {
            setError('Impossible de retirer la demande du dossier');
        }
    };

    if (isLoading && !currentFolder) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        );
    }

    if (!currentFolder && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Dossier introuvable</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-md">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {currentFolder && (
                <FolderDetail
                    folder={currentFolder}
                    onDelete={handleDelete}
                    onRemoveRequest={handleRemoveRequest}
                />
            )}
        </div>
    );
}