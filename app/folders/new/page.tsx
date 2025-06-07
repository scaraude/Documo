// app/folders/new/page.tsx
'use client'
import { useFolders } from '@/features/folders/';
import { FolderForm } from '@/features/folders/components/FolderForm';
import { CreateFolderParams } from '@/features/folders/types';
import { toast } from 'sonner';

export default function NewFolderPage() {
    const { createFolderMutation } = useFolders();

    const handleSubmit = async (data: CreateFolderParams) => {
        try {
            createFolderMutation.mutate(data);
        } catch {
            toast.error('Une erreur est survenue');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer un nouveau dossier</h1>

            <div className="bg-white shadow-md rounded-lg p-6">
                <FolderForm
                    onSubmit={handleSubmit}
                    isLoading={false}
                />
            </div>
        </div>
    );
}