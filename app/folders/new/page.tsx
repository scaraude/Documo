// app/folders/new/page.tsx
'use client'
import { FolderForm } from '@/features/folders/components/FolderForm';

export default function NewFolderPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer un nouveau dossier</h1>

            <div className="bg-white shadow-md rounded-lg p-6">
                <FolderForm
                    isLoading={false}
                />
            </div>
        </div>
    );
}