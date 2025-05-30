// features/folder-types/components/CustomFieldBuilder.tsx
'use client'
import { CustomField } from '../types';

interface CustomFieldBuilderProps {
    field: CustomField;
    onChange: (field: CustomField) => void;
}

export const CustomFieldBuilder = ({ field, onChange }: CustomFieldBuilderProps) => {
    const updateField = (updates: Partial<CustomField>) => {
        onChange({ ...field, ...updates });
    };

    const updateValidation = (validationUpdates: Partial<CustomField['validation']>) => {
        onChange({
            ...field,
            validation: { ...field.validation, ...validationUpdates }
        });
    };

    return (
        <div className="space-y-4">
            {/* Basic Field Info */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Nom du champ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField({ name: e.target.value })}
                        placeholder="Ex: Adresse, Téléphone..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Type de champ
                    </label>
                    <select
                        value={field.type}
                        onChange={(e) => updateField({ type: e.target.value as CustomField['type'] })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="text">Texte</option>
                        <option value="number">Nombre</option>
                        <option value="email">Email</option>
                        <option value="tel">Téléphone</option>
                        <option value="url">URL</option>
                        <option value="date">Date</option>
                    </select>
                </div>
            </div>

            {/* Field Options */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Placeholder (optionnel)
                    </label>
                    <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField({ placeholder: e.target.value })}
                        placeholder="Texte d'aide pour l'utilisateur"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center pt-6">
                    <input
                        type="checkbox"
                        id={`required-${field.id}`}
                        checked={field.required}
                        onChange={(e) => updateField({ required: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`required-${field.id}`} className="ml-2 text-sm text-gray-700">
                        Champ obligatoire
                    </label>
                </div>
            </div>

            {/* Validation Rules */}
            {(field.type === 'text' || field.type === 'number') && (
                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Règles de validation</h4>

                    {field.type === 'text' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600">
                                    Longueur minimale
                                </label>
                                <input
                                    type="number"
                                    value={field.validation?.minLength || ''}
                                    onChange={(e) => updateValidation({
                                        minLength: e.target.value ? parseInt(e.target.value) : undefined
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">
                                    Longueur maximale
                                </label>
                                <input
                                    type="number"
                                    value={field.validation?.maxLength || ''}
                                    onChange={(e) => updateValidation({
                                        maxLength: e.target.value ? parseInt(e.target.value) : undefined
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {field.type === 'number' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600">
                                    Valeur minimale
                                </label>
                                <input
                                    type="number"
                                    value={field.validation?.min || ''}
                                    onChange={(e) => updateValidation({
                                        min: e.target.value ? parseInt(e.target.value) : undefined
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">
                                    Valeur maximale
                                </label>
                                <input
                                    type="number"
                                    value={field.validation?.max || ''}
                                    onChange={(e) => updateValidation({
                                        max: e.target.value ? parseInt(e.target.value) : undefined
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};