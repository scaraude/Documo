// app/folders/new/page.tsx
'use client'
import { Suspense } from 'react';
import { FolderForm } from '@/features/folders/components/FolderForm';

function FolderFormWrapper() {
    return (
        <FolderForm isLoading={false} />
    );
}

export default function NewFolderPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer un nouveau dossier</h1>

            <div className="bg-white shadow-md rounded-lg p-6">
                <Suspense fallback={
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                }>
                    <FolderFormWrapper />
                </Suspense>
            </div>
        </div>
    );
}