// features/folder-types/components/FolderTypeForm.tsx
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, APP_DOCUMENT_TYPES, AppDocumentType } from '@/shared/constants';
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '@/shared/mapper';
import { CreateFolderTypeParams, CustomField } from '../types';
import { CustomFieldBuilder } from './CustomFieldBuilder';
import { Button } from '@/shared/components';
import { Trash2, Plus } from 'lucide-react';

interface FolderTypeFormProps {
    onSubmit: (data: CreateFolderTypeParams) => Promise<void>;
    isLoading: boolean;
}

export const FolderTypeForm = ({ onSubmit, isLoading }: FolderTypeFormProps) => {
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [requiredDocuments, setRequiredDocuments] = useState<AppDocumentType[]>([]);
    const [customFields, setCustomFields] = useState<CustomField[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData: CreateFolderTypeParams = {
                name,
                description,
                requiredDocuments,
                customFields
            };

            await onSubmit(formData);
            router.push(ROUTES.FOLDERS.HOME);
        } catch (error) {
            console.error('Error submitting folder type:', error);
        }
    };

    const toggleDocumentType = (docType: AppDocumentType) => {
        setRequiredDocuments(prev =>
            prev.includes(docType)
                ? prev.filter(dt => dt !== docType)
                : [...prev, docType]
        );
    };

    const addCustomField = () => {
        const newField: CustomField = {
            id: `field_${Date.now()}`,
            name: '',
            type: 'text',
            required: false,
            placeholder: ''
        };
        setCustomFields(prev => [...prev, newField]);
    };

    const updateCustomField = (index: number, field: CustomField) => {
        setCustomFields(prev => prev.map((f, i) => i === index ? field : f));
    };

    const removeCustomField = (index: number) => {
        setCustomFields(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Informations de base</h2>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
                    Sélectionnez les documents que les utilisateurs devront fournir pour ce type de dossier.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
                    {Object.values(APP_DOCUMENT_TYPES).map((docType) => (
                        <label key={docType} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={requiredDocuments.includes(docType)}
                                onChange={() => toggleDocumentType(docType)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {APP_DOCUMENT_TYPE_TO_LABEL_MAP[docType]}
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

            {/* Custom Fields */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Champs personnalisés</h2>
                        <p className="text-sm text-gray-600">
                            Ajoutez des champs spécifiques à votre processus (optionnel).
                        </p>
                    </div>
                    <Button type="button" variant="outline" onClick={addCustomField}>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un champ
                    </Button>
                </div>

                {customFields.length > 0 && (
                    <div className="space-y-4 border border-gray-200 rounded-md p-4">
                        {customFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start p-4 border border-gray-100 rounded-md">
                                <div className="flex-1">
                                    <CustomFieldBuilder
                                        field={field}
                                        onChange={(updatedField) => updateCustomField(index, updatedField)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeCustomField(index)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit */}
            <div className="flex justify-between pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
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