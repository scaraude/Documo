// features/folder-types/components/FolderTypeForm.tsx
'use client';
import { Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type React from 'react';
import {
  type DocumentTypeId,
  useDocumentTypes,
} from '../../document-types/client';
import type { CreateFolderTypeParams } from '../types';

interface FolderTypeFormProps {
  onSubmit: (data: CreateFolderTypeParams) => Promise<void>;
  isLoading: boolean;
  initialValues?: {
    name?: string;
    description?: string;
    requiredDocuments?: DocumentTypeId[];
  };
  submitLabel?: string;
  successRedirect?: string;
}

export const FolderTypeForm = ({
  onSubmit,
  isLoading,
  initialValues,
  submitLabel = 'Créer le modèle de dossier',
  successRedirect = ROUTES.FOLDER_TYPES.HOME,
}: FolderTypeFormProps) => {
  const router = useRouter();

  const { documentTypes, isLoading: isLoadingDocTypes } = useDocumentTypes();

  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(
    initialValues?.description || '',
  );
  const [requiredDocuments, setRequiredDocuments] = useState<DocumentTypeId[]>(
    initialValues?.requiredDocuments || [],
  );

  // Autocomplete state
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData: CreateFolderTypeParams = {
        name,
        description,
        requiredDocuments,
      };

      await onSubmit(formData);
      router.push(successRedirect);
    } catch (error) {
      console.error('Error submitting folder type:', error);
    }
  };

  const toggleDocumentType = (docTypeId: DocumentTypeId) => {
    setRequiredDocuments((prev) =>
      prev.includes(docTypeId)
        ? prev.filter((dt) => dt !== docTypeId)
        : [...prev, docTypeId],
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-[var(--documo-black)]">
          Informations de base
        </h2>

        <div className="relative">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[var(--documo-text-secondary)]"
          >
            Modèle de dossier{' '}
            <span className="text-[var(--documo-error)]">*</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            id="name"
            required
            autoComplete="off"
            className="mt-1 block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--documo-blue)] focus:border-[var(--documo-blue)]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Dossier locatif, Demande de vente..."
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[var(--documo-text-secondary)]"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--documo-blue)] focus:border-[var(--documo-blue)]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décris l'usage de ce modèle de dossier..."
          />
        </div>
      </div>

      {/* Required Documents */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--documo-black)]">
          Documents requis
        </h2>
        <p className="text-sm text-[var(--documo-text-secondary)]">
          Sélectionne les documents que les utilisateurs devront fournir pour ce
          modèle de dossier.
        </p>

        {isLoadingDocTypes ? (
          <div className="border border-[var(--border)] rounded-md p-4">
            <p className="text-sm text-[var(--documo-text-tertiary)]">
              Chargement des types de documents...
            </p>
          </div>
        ) : documentTypes.length === 0 ? (
          <div className="border border-[var(--documo-warning)]/30 bg-[var(--documo-warning)]/5 rounded-md p-4">
            <p className="text-sm text-[var(--documo-text-secondary)]">
              Aucun type de document disponible. Contacte l&apos;administrateur
              pour en ajouter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-[var(--border)] rounded-md p-4 max-h-60 overflow-y-auto">
            {documentTypes.map((docType) => (
              <label
                key={docType.id}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={requiredDocuments.includes(docType.id)}
                  onChange={() => toggleDocumentType(docType.id)}
                  className="h-4 w-4 text-[var(--documo-blue)] focus:ring-[var(--documo-blue)] border-[var(--border)] rounded"
                />
                <span className="ml-2 text-sm text-[var(--documo-text-secondary)]">
                  {docType.label}
                </span>
              </label>
            ))}
          </div>
        )}

        {requiredDocuments.length === 0 && documentTypes.length > 0 && (
          <p className="text-sm text-[var(--documo-text-tertiary)]">
            * Sélectionne au moins un type de document
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-between pt-6 border-t border-[var(--border)]">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !name || requiredDocuments.length === 0}
        >
          {isLoading ? 'Enregistrement...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};
