'use client';
import { useFolderTypes } from '@/features/folder-types';
import { FolderTypeForm } from '@/features/folder-types/components/FolderTypeForm';
import type { CreateFolderTypeParams } from '@/features/folder-types/types';
import { useState } from 'react';

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
      <h1 className="text-2xl font-bold text-[var(--documo-black)] mb-6">
        Créer un type de dossier
      </h1>

      <div className="mb-6 p-4 bg-[var(--documo-blue-light)] border border-[var(--documo-blue)]/20 rounded-md">
        <h3 className="text-sm font-medium text-[var(--documo-blue-deep)] mb-1">
          Qu&apos;est-ce qu&apos;un type de dossier ?
        </h3>
        <p className="text-sm text-[var(--documo-text-secondary)]">
          Un type de dossier est un modèle qui définit quels documents sont
          nécessaires pour un processus spécifique (ex : dossier locatif,
          demande de vente, dossier d&apos;achat). Une fois créé, tu pourras
          ouvrir plusieurs dossiers basés sur ce type.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-[var(--documo-error)]/5 border border-[var(--documo-error)]/20 rounded-md">
          <p className="text-sm text-[var(--documo-error)]">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <FolderTypeForm onSubmit={handleSubmit} isLoading={false} />
      </div>
    </div>
  );
}
