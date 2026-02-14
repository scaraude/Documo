'use client';

import { useFolderTypes } from '@/features/folder-types';
import { FolderTypeForm } from '@/features/folder-types/components/FolderTypeForm';
import type { CreateFolderTypeParams } from '@/features/folder-types/types';
import { Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function EditFolderTypePage() {
  const { id: folderTypeId }: { id: string } = useParams();
  const { getFolderTypeById, updateFolderTypeMutation } = useFolderTypes();
  const { data: folderType, isLoading } = getFolderTypeById(folderTypeId);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateFolderTypeParams) => {
    try {
      setError(null);
      await updateFolderTypeMutation.mutateAsync({
        id: folderTypeId,
        params: {
          name: data.name,
          description: data.description,
          requiredDocuments: data.requiredDocuments,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--documo-bg-light)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--documo-blue)] border-t-transparent" />
      </div>
    );
  }

  if (!folderType) {
    return (
      <div className="min-h-screen bg-[var(--documo-bg-light)] px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white border border-[var(--border)] rounded-xl p-8 text-center">
          <h1 className="text-xl font-semibold text-[var(--documo-black)]">
            Modèle de dossier introuvable
          </h1>
          <p className="mt-2 text-sm text-[var(--documo-text-secondary)]">
            Ce modèle de dossier n&apos;existe pas ou n&apos;est plus
            disponible.
          </p>
          <Button asChild className="mt-6">
            <Link href={ROUTES.FOLDER_TYPES.HOME}>Retour aux modèles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--documo-bg-light)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-[var(--documo-black)] mb-6">
          Modifier le modèle de dossier
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-[var(--documo-error)]/5 border border-[var(--documo-error)]/20 rounded-md">
            <p className="text-sm text-[var(--documo-error)]">{error}</p>
          </div>
        )}

        <div className="bg-white shadow-sm border border-[var(--border)] rounded-lg p-6">
          <FolderTypeForm
            onSubmit={handleSubmit}
            isLoading={updateFolderTypeMutation.isPending}
            initialValues={{
              name: folderType.name,
              description: folderType.description,
              requiredDocuments: folderType.requiredDocuments.map(
                (doc) => doc.id,
              ),
            }}
            submitLabel="Enregistrer les modifications"
            successRedirect={ROUTES.FOLDER_TYPES.HOME}
          />
        </div>
      </div>
    </div>
  );
}
