// features/folders/components/FolderForm.tsx
'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { CreateFolderParams, Folder } from '../types';
import { useFolderTypes } from '@/features/folder-types';
import { useRequests } from '@/features/requests/hooks/useRequests';
import { FolderType } from '@/features/folder-types/types';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/components';
import { ChevronLeft, ChevronRight, FolderOpen, FileText, Users, Send, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '../../../shared/mapper';
import { useFolders } from '../hooks/useFolders';
import { toast } from 'sonner';

interface FolderFormProps {
    isLoading: boolean;
}

export const FolderForm = ({ isLoading }: FolderFormProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedTypeId = searchParams?.get('typeId');


    const { createFolderMutation } = useFolders();
    const { getAllFolderTypes } = useFolderTypes();
    const { data: folderTypes, isLoading: isFolderTypesLoading } = getAllFolderTypes();
    const { createRequestMutation } = useRequests();

    const [step, setStep] = useState<'selectType' | 'fillForm' | 'sendRequests'>('selectType');
    const [selectedType, setSelectedType] = useState<FolderType | null>(null);
    const [createdFolder, setCreatedFolder] = useState<Folder | null>(null);

    // Form data
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [expirationDate, setExpirationDate] = useState<string>('');

    // Requests data
    const [civilIds, setCivilIds] = useState<string[]>(['']);
    const [sendNotifications, setSendNotifications] = useState(true);

    const onSubmit = async (data: CreateFolderParams) => {
        try {
            createFolderMutation.mutate(data, {
                onSuccess: (folder) => {
                    setCreatedFolder(folder);
                    toast.success('Dossier créé avec succès !');
                    setStep('sendRequests');
                }
            });
        } catch {
            toast.error('Une erreur est survenue');
        }
    };

    // Si un typeId est fourni en query param, sélectionner automatiquement le type
    useEffect(() => {
        if (preSelectedTypeId && folderTypes && folderTypes.length > 0) {
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
    };

    const handleFolderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedType) return;

        try {
            const formData: CreateFolderParams = {
                name,
                description,
                folderTypeId: selectedType.id,
                requestedDocuments: selectedType.requiredDocuments,
                expiresAt: expirationDate ? new Date(expirationDate) : null
            };

            setStep('sendRequests');
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting folder:', error);
        }
    };

    const addCivilId = () => {
        setCivilIds(prev => [...prev, '']);
    };

    const removeCivilId = (index: number) => {
        setCivilIds(prev => prev.filter((_, i) => i !== index));
    };

    const updateCivilId = (index: number, value: string) => {
        setCivilIds(prev => prev.map((id, i) => i === index ? value : id));
    };

    const handleSendRequests = async () => {
        if (!createdFolder || !selectedType) return;

        const validCivilIds = civilIds.filter(id => id.trim() !== '');

        if (validCivilIds.length === 0) {
            // Pas de demandes, aller directement au dossier
            router.push(ROUTES.FOLDERS.DETAIL(createdFolder.id));
            return;
        }

        try {
            await Promise.all(
                validCivilIds.map(civilId =>
                    createRequestMutation.mutateAsync(
                        {
                            civilId: civilId.trim(),
                            requestedDocuments: selectedType.requiredDocuments,
                            folderId: createdFolder.id,
                        }
                    )
                )
            );

            router.push(ROUTES.FOLDERS.DETAIL(createdFolder.id));
        } catch (error) {
            console.error('Error sending requests:', error);
        }
    };

    const skipRequests = () => {
        if (createdFolder) {
            router.push(ROUTES.FOLDERS.DETAIL(createdFolder.id));
        }
    };

    if (isLoading || isFolderTypesLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!folderTypes || folderTypes.length === 0) {
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
                        <Link href="/folder-types/new">
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
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'fillForm' ? 'bg-blue-600 text-white' :
                        step === 'sendRequests' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'
                        }`}>
                        {step === 'sendRequests' ? '✓' : '2'}
                    </div>
                    <span className={`font-medium ${step === 'fillForm' ? 'text-blue-600' :
                        step === 'sendRequests' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                        Créer le dossier
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'sendRequests' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                        }`}>
                        3
                    </div>
                    <span className={`font-medium ${step === 'sendRequests' ? 'text-blue-600' : 'text-gray-500'}`}>
                        Envoyer des demandes
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
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Fill Form */}
            {step === 'fillForm' && selectedType && (
                <form onSubmit={handleFolderSubmit} className="space-y-6">
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
                                        {APP_DOCUMENT_TYPE_TO_LABEL_MAP[doc]}
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

            {/* Step 3: Send Requests */}
            {step === 'sendRequests' && createdFolder && selectedType && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="h-5 w-5 mr-2 text-green-600" />
                                Dossier créé avec succès !
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Votre dossier <strong>{createdFolder.name}</strong> a été créé.
                                Vous pouvez maintenant envoyer des demandes de documents aux personnes concernées.
                            </p>
                            <div className="bg-blue-50 p-4 rounded-md">
                                <h4 className="font-medium text-blue-900 mb-2">Documents qui seront demandés :</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedType.requiredDocuments.map((doc, index) => (
                                        <Badge key={index} variant="outline" className="text-blue-700 border-blue-300">
                                            {APP_DOCUMENT_TYPE_TO_LABEL_MAP[doc]}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center">
                                    <Send className="h-5 w-5 mr-2" />
                                    Envoyer des demandes
                                </span>
                                <Button variant="outline" size="sm" onClick={addCivilId}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ajouter une personne
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Ajoutez les ID civils des personnes à qui vous voulez envoyer une demande de documents.
                            </p>

                            <div className="space-y-3">
                                {civilIds.map((civilId, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={civilId}
                                            onChange={(e) => updateCivilId(index, e.target.value)}
                                            placeholder="ID civil (ex: 123456789)"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {civilIds.length > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeCivilId(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center pt-4">
                                <input
                                    type="checkbox"
                                    id="sendNotifications"
                                    checked={sendNotifications}
                                    onChange={(e) => setSendNotifications(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="sendNotifications" className="ml-2 text-sm text-gray-700">
                                    Envoyer des notifications aux personnes concernées
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={skipRequests}>
                            Passer cette étape
                        </Button>
                        <Button onClick={handleSendRequests}>
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer les demandes
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};