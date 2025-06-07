// app/folder-types/[id]/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFolderTypes } from '@/features/folder-types';
import { FolderTypeDetail } from '@/features/folder-types/components/FolderTypeDetail';
import { ROUTES } from '@/shared/constants';

export default function FolderTypeDetailPage() {
    const { id: folderTypeId }: { id: string } = useParams();
    const router = useRouter();
    const { loadFolderType, currentFolderType, deleteFolderType, isLoading } = useFolderTypes();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFolderType() {
            try {
                setError(null);
                await loadFolderType(folderTypeId);
            } catch {
                setError('Impossible de charger le type de dossier');
            }
        }

        if (folderTypeId) {
            fetchFolderType();
        }
    }, [folderTypeId, loadFolderType]);

    const handleDelete = async (id: string) => {
        try {
            await deleteFolderType(id);
            router.push(ROUTES.FOLDERS.HOME);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de supprimer le type de dossier');
        }
    };

    if (isLoading && !currentFolderType) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentFolderType && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Type de dossier introuvable</p>
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

            {currentFolderType && (
                <FolderTypeDetail
                    folderType={currentFolderType}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}