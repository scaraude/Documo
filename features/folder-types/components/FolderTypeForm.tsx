// features/folder-types/components/FolderTypeForm.tsx
'use client';
import { Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import {
  type DocumentTypeId,
  useDocumentTypes,
} from '../../document-types/client';
import { useFolderTypes } from '../hooks/useFolderTypes';
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

  const { documentTypes, isLoading: isLoadingDocTypes } = useDocumentTypes();
  const { getAllFolderTypes } = useFolderTypes();
  const { data: existingFolderTypes } = getAllFolderTypes();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState<DocumentTypeId[]>(
    [],
  );

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (existingFolderTypes && name.length > 0) {
      const filtered = existingFolderTypes
        .map((ft) => ft.name)
        .filter((ftName) => ftName.toLowerCase().includes(name.toLowerCase()));
      setFilteredSuggestions(filtered);
    } else if (existingFolderTypes) {
      setFilteredSuggestions(existingFolderTypes.map((ft) => ft.name));
    } else {
      setFilteredSuggestions([]);
    }
  }, [name, existingFolderTypes]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestionName: string) => {
    setName(suggestionName);
    setShowSuggestions(false);

    // Pre-fill documents from existing folder type
    const existingType = existingFolderTypes?.find(
      (ft) => ft.name === suggestionName,
    );
    if (existingType?.requiredDocuments) {
      setRequiredDocuments(
        existingType.requiredDocuments.map((doc) => doc.id as DocumentTypeId),
      );
      if (existingType.description) {
        setDescription(existingType.description);
      }
    }
  };

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

  const isNewType =
    name.length > 0 &&
    !existingFolderTypes?.some(
      (ft) => ft.name.toLowerCase() === name.toLowerCase(),
    );

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
            Type de dossier{' '}
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
            onFocus={() => setShowSuggestions(true)}
            placeholder="Ex : Dossier locatif, Demande de vente..."
          />

          {/* Autocomplete suggestions */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 mt-1 w-full bg-white border border-[var(--border)] rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {/* Create new option */}
              {name.length > 0 && isNewType && (
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 bg-[var(--documo-blue-light)] text-[var(--documo-blue-deep)] hover:bg-[var(--documo-blue)]/10 border-b border-[var(--border)]"
                  onClick={() => setShowSuggestions(false)}
                >
                  <Plus className="h-4 w-4" />
                  Créer « {name} »
                </button>
              )}

              {/* Existing folder types */}
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-[var(--documo-black)] hover:bg-[var(--documo-bg-light)]"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-[var(--documo-text-tertiary)]">
                  Aucun type de dossier existant
                </div>
              )}
            </div>
          )}
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
            placeholder="Décris l'usage de ce type de dossier..."
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
          type de dossier.
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
          <p className="text-sm text-[var(--documo-error)]">
            Sélectionne au moins un type de document
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
          {isLoading ? 'Création...' : 'Créer le type de dossier'}
        </Button>
      </div>
    </form>
  );
};
