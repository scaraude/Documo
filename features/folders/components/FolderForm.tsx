// features/folders/components/FolderForm.tsx
'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { CreateFolderParams } from '../types';
import { useFolderTypes } from '@/features/folder-types';
import { useCustomFieldValidation } from '@/features/folder-types/hooks/useCustomFieldValidation';
import { FolderType } from '@/features/folder-types/types';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/components';
import { ChevronLeft, ChevronRight, FolderOpen, FileText, Settings } from 'lucide-react';
import Link from 'next/link';

interface FolderFormProps {
    onSubmit: (data: CreateFolderParams) => Promise<void>;
    isLoading: boolean;
}

export const FolderForm = ({ onSubmit, isLoading }: FolderFormProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedTypeId = searchParams?.get('typeId');

    const { folderTypes, isLoaded } = useFolderTypes();
    const { validateAllFields, getFieldInputType } = useCustomFieldValidation();

    const [step, setStep] = useState<'selectType' | 'fillForm'>('selectType');
    const [selectedType, setSelectedType] = useState<FolderType | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [expirationDate, setExpirationDate] = useState<string>('');
    const [customFieldsData, setCustomFieldsData] = useState<Record<string, string>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Si un typeId est fourni en query param, sélectionner automatiquement le type
    useEffect(() => {
        if (preSelectedTypeId && folderTypes.length > 0) {
            const foundType = folderTypes.find(type => type.id === preSelectedTypeId);
            if (foundType) {
                setSelectedType(foundType);
                setStep('fillForm');
            }
        }
    }, [preSelectedTypeId, folderTypes]);

    const handleTypeSelect = (folderType: FolderType) => {
        setSelectedType(folderType);
        setStep('fillForm');
        // Initialiser les champs personnalisés
        const initialFields: Record<string, string> = {};
        folderType.customFields.forEach(field => {
            initialFields[field.id] = '';
        });
        setCustomFieldsData(initialFields);
    };

    const handleCustomFieldChange = (fieldId: string, value: string) => {
        setCustomFieldsData(prev => ({
            ...prev,
            [fieldId]: value
        }));
        // Supprimer l'erreur de validation si elle existe
        if (validationErrors[fieldId]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedType) return;

        // Valider les champs personnalisés
        const errors = validateAllFields(selectedType.customFields, customFieldsData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const formData: CreateFolderParams = {
                name,
                description,
                folderTypeId: selectedType.id,
                customFieldsData,
                expiresAt: expirationDate ? new Date(expirationDate) : null
            };

            await onSubmit(formData);
            router.push(ROUTES.FOLDERS.HOME);
        } catch (error) {
            console.error('Error submitting folder:', error);
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (folderTypes.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun type de dossier disponible
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Vous devez d&apos;abord créer un type de dossier avant de pouvoir créer un dossier
                    </p>
                    <Button asChild>
                        <Link href={ROUTES.FOLDER_TYPES.NEW}>
                            Créer un type de dossier
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'selectType' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                        }`}>
                        {step === 'selectType' ? '1' : '✓'}
                    </div>
                    <span className={`font-medium ${step === 'selectType' ? 'text-blue-600' : 'text-green-600'}`}>
                        Sélectionner le type
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'fillForm' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                        }`}>
                        2
                    </div>
                    <span className={`font-medium ${step === 'fillForm' ? 'text-blue-600' : 'text-gray-500'}`}>
                        Remplir les informations
                    </span>
                </div>
                {step === 'fillForm' && !preSelectedTypeId && (
                    <Button variant="outline" onClick={() => setStep('selectType')}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>
                )}
            </div>

            {/* Step 1: Select Type */}
            {step === 'selectType' && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Choisissez un type de dossier
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folderTypes.map((folderType) => (
                            <Card
                                key={folderType.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleTypeSelect(folderType)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FolderOpen className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {folderType.requiredDocuments.length} docs
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg">{folderType.name}</CardTitle>
                                    {folderType.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {folderType.description}
                                        </p>
                                    )}
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FileText className="h-4 w-4" />
                                        <span>{folderType.requiredDocuments.length} document{folderType.requiredDocuments.length > 1 ? 's' : ''} requis</span>
                                        {folderType.customFields.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <Settings className="h-4 w-4" />
                                                <span>{folderType.customFields.length} champ{folderType.customFields.length > 1 ? 's' : ''}</span>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Fill Form */}
            {step === 'fillForm' && selectedType && (
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
                            <p className="text-gray-600 mb-4">{selectedType.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedType.requiredDocuments.map((doc, index) => (
                                    <Badge key={index} variant="outline">
                                        {doc}
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
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description (optionnel)
                                </label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description de ce dossier"
                                />
                            </div>

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
                        </CardContent>
                    </Card>

                    {/* Custom Fields */}
                    {selectedType.customFields.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Champs spécifiques</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedType.customFields.map((field) => (
                                    <div key={field.id}>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {field.name}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        <input
                                            type={getFieldInputType(field.type)}
                                            required={field.required}
                                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${validationErrors[field.id] ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            value={customFieldsData[field.id] || ''}
                                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                                            placeholder={field.placeholder}
                                        />
                                        {validationErrors[field.id] && (
                                            <p className="mt-1 text-sm text-red-600">{validationErrors[field.id]}</p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Submit */}
                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !name}
                        >
                            {isLoading ? 'Création...' : 'Créer le dossier'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};