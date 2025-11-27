// features/folder-types/components/FolderTypeForm.tsx
'use client';
import { Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type React from 'react';
import {
  type DocumentTypeId,
  useDocumentTypes,
} from '../../document-types/client';
import type { CreateFolderTypeParams } from '../types';

interface FolderTypeFormProps {
  onSubmit: (data: CreateFolderTypeParams) => Promise<void>;
  isLoading: boolean;
}

export const FolderTypeForm = ({
  onSubmit,
  isLoading,
}: FolderTypeFormProps) => {
  const router = useRouter();

  const { documentTypes } = useDocumentTypes();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState<DocumentTypeId[]>(
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData: CreateFolderTypeParams = {
        name,
        description,
        requiredDocuments,
      };

      await onSubmit(formData);
      router.push(ROUTES.FOLDERS.HOME);
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
        <h2 className="text-lg font-medium text-gray-900">
          Informations de base
        </h2>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nom du type de dossier <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Dossier locatif, Demande de crédit..."
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez l'usage de ce type de dossier..."
          />
        </div>
      </div>

      {/* Required Documents */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Documents requis</h2>
        <p className="text-sm text-gray-600">
          Sélectionnez les documents que les utilisateurs devront fournir pour
          ce type de dossier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
          {documentTypes.map((docType) => (
            <label key={docType.id} className="flex items-center">
              <input
                type="checkbox"
                checked={requiredDocuments.includes(docType.id)}
                onChange={() => toggleDocumentType(docType.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {docType.label}
              </span>
            </label>
          ))}
        </div>

        {requiredDocuments.length === 0 && (
          <p className="text-sm text-red-500">
            Veuillez sélectionner au moins un type de document
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !name || requiredDocuments.length === 0}
        >
          {isLoading ? 'Création...' : 'Créer le type de dossier'}
        </Button>
      </div>
    </form>
  );
};
