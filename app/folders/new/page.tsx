// app/folders/new/page.tsx
'use client'
import { useState } from 'react';
import { useFolder } from '@/features/folders/hooks/useFolder';
import { FolderForm } from '@/features/folders/components/FolderForm';
import { CreateFolderParams } from '@/features/folders/types';

export default function NewFolderPage() {
    const { createFolder, isLoading } = useFolder();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: CreateFolderParams) => {
        try {
            setError(null);
            await createFolder(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer un nouveau dossier</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-md">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6">
                <FolderForm<CreateFolderParams>
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}