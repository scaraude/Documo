'use client';
import { useState } from 'react';
import { useFolderTypes } from '@/features/folder-types';
import { FolderTypeForm } from '@/features/folder-types/components/FolderTypeForm';
import { CreateFolderTypeParams } from '@/features/folder-types/types';

export default function NewFolderTypePage() {
  const { createFolderTypeMutation } = useFolderTypes();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateFolderTypeParams) => {
    try {
      setError(null);
      createFolderTypeMutation.mutate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Créer un nouveau type de dossier
      </h1>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-1">
          Qu&apos;est-ce qu&apos;un type de dossier ?
        </h3>
        <p className="text-sm text-blue-700">
          Un type de dossier est un modèle qui définit quels documents sont
          nécessaires pour un processus spécifique (ex: dossier locatif, demande
          de crédit, inscription scolaire). Une fois créé, vous pourrez créer
          plusieurs dossiers basés sur ce type.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <FolderTypeForm onSubmit={handleSubmit} isLoading={false} />
      </div>
    </div>
  );
}
