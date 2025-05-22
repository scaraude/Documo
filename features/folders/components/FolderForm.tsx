// features/folders/components/FolderForm.tsx
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, APP_DOCUMENT_TYPES, AppDocumentType, FOLDER_STATUS } from '@/shared/constants';
import { BaseFolder, CreateFolderParams, UpdateFolderParams } from '../types/folder';
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '../../../shared/mapper';

interface FolderFormProps<T extends CreateFolderParams | UpdateFolderParams> {
    initialData?: BaseFolder;
    onSubmit: (data: T) => Promise<void>;
    isLoading: boolean;
}

export const FolderForm = <T extends CreateFolderParams | UpdateFolderParams>({
    initialData,
    onSubmit,
    isLoading
}: FolderFormProps<T>) => {
    const router = useRouter();
    const isEditMode = !!initialData;

    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [status, setStatus] = useState<FOLDER_STATUS>(
        initialData?.status || FOLDER_STATUS.ACTIVE
    );
    const [selectedDocuments, setSelectedDocuments] = useState<AppDocumentType[]>(
        initialData?.requestedDocuments || []
    );
    const [expirationDate, setExpirationDate] = useState<string>(
        initialData?.expiresAt
            ? new Date(initialData.expiresAt).toISOString().split('T')[0]
            : ''
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = {
                name,
                description,
                status,
                requestedDocuments: selectedDocuments,
                expiresAt: expirationDate ? new Date(expirationDate) : null
            } as T;

            await onSubmit(formData);
            router.push(ROUTES.FOLDERS.HOME);
        } catch (error) {
            console.error('Error submitting folder:', error);
            // You could add error handling UI here
        }
    };

    const toggleDocumentType = (docType: AppDocumentType) => {
        setSelectedDocuments(prev =>
            prev.includes(docType)
                ? prev.filter(dt => dt !== docType)
                : [...prev, docType]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom du dossier
                </label>
                <input
                    type="text"
                    id="name"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom du dossier"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description du dossier (optionnel)"
                />
            </div>

            {isEditMode && (
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Statut
                    </label>
                    <select
                        id="status"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as FOLDER_STATUS)}
                    >
                        <option value={FOLDER_STATUS.ACTIVE}>Actif</option>
                        <option value={FOLDER_STATUS.PENDING}>En attente</option>
                        <option value={FOLDER_STATUS.COMPLETED}>Complété</option>
                        <option value={FOLDER_STATUS.ARCHIVED}>Archivé</option>
                    </select>
                </div>
            )}

            <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
                    Date d&apos;expiration (optionnel)
                </label>
                <input
                    type="date"
                    id="expirationDate"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documents requis
                </label>
                <div className="space-y-2 border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
                    {Object.values(APP_DOCUMENT_TYPES).map((docType) => (
                        <label key={docType} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedDocuments.includes(docType)}
                                onChange={() => toggleDocumentType(docType)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{APP_DOCUMENT_TYPE_TO_LABEL_MAP[docType]}</span>
                        </label>
                    ))}
                </div>
                {selectedDocuments.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                        Veuillez sélectionner au moins un type de document
                    </p>
                )}
            </div>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !name || selectedDocuments.length === 0}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isLoading || !name || selectedDocuments.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isLoading ? 'Chargement...' : isEditMode ? 'Mettre à jour' : 'Créer'}
                </button>
            </div>
        </form>
    );
};