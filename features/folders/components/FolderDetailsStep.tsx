import type { FolderType } from '@/features/folder-types/types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components';
import type { AppDocumentType } from '@/shared/constants';
import { FolderOpen } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import type { CreateFolderParams } from '../types';

interface FolderDetailsStepProps {
  selectedType: FolderType;
  isLoading: boolean;
  onSubmit: (data: CreateFolderParams) => Promise<void>;
  onCancel: () => void;
}

export const FolderDetailsStep = ({
  selectedType,
  isLoading,
  onSubmit,
  onCancel,
}: FolderDetailsStepProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const formData: CreateFolderParams = {
      name: name.trim(),
      description: description.trim() || undefined,
      folderTypeId: selectedType.id,
      requestedDocumentIds: selectedType.requiredDocuments.map(
        (doc) => doc.id,
      ),
      expiresAt: expirationDate ? new Date(expirationDate) : null,
    };

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Selected Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
            Type sélectionné: {selectedType.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedType.description && (
            <p className="text-gray-600 mb-4">{selectedType.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {selectedType.requiredDocuments.map((doc) => (
              <Badge key={doc.id} variant="outline">
                {doc.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du dossier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom du dossier <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de ce dossier spécifique"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (optionnel)
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de ce dossier"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="expirationDate"
              className="block text-sm font-medium text-gray-700"
            >
              Date d&apos;expiration (optionnel)
            </label>
            <input
              type="date"
              id="expirationDate"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              disabled={isLoading}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? 'Création...' : 'Créer le dossier'}
        </Button>
      </div>
    </form>
  );
};
