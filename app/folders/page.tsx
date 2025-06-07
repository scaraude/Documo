'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, FileText } from 'lucide-react';
import { FolderType, useFolderTypes } from '../../features/folder-types';
import { useFolders } from '../../features/folders/hooks/useFolders';
import { Button, Card, CardContent, Badge, ScrollArea, ScrollBar } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ComputedFolderStatus, FolderWithStatus } from '../../features/folders/types';
import { useRouter } from 'next/navigation';

export default function FoldersPage() {
    const { getAllFolderTypes } = useFolderTypes();
    const { data: folderTypes, isLoading: isfolderTypesLoading } = getAllFolderTypes();
    const { getAllFolders } = useFolders();
    const { data: folders, isLoading } = getAllFolders();

    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');

    const filteredFolders = folders?.filter(folder =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: ComputedFolderStatus) => {
        switch (status) {
            case 'PENDING':
            case 'ACTIVE':
                return <Badge className="bg-yellow-100 text-yellow-800">🕐 En attente</Badge>;
            case 'COMPLETED':
                return <Badge className="bg-green-100 text-green-800">✅ Terminé</Badge>;
            case 'ARCHIVED':
                return <Badge className="bg-red-100 text-red-800">❌ Refusé</Badge>;
            default:
                const never: never = status;
                return never;
        }
    };


    const FolderGridItem = ({ folderType }: {
        folderType: FolderType & {
            foldersCount?: number;
            activeFoldersCount?: number;
        };
    }) => {
        return <div className="group cursor-pointer" onClick={() => router.push(ROUTES.FOLDER_TYPES.DETAIL(folderType.id))}>

            {/* Folder Representation */}
            <div className="relative">

                <div className="absolute bottom-4 right-4 z-50">
                    <Link
                        href={`${ROUTES.FOLDERS.NEW}?typeId=${folderType.id}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="w-9 h-9 border border-stone-400 text-stone-400 rounded-full hover:text-white hover:bg-stone-700 hover:scale-120 transition-all duration-200 flex items-center justify-center group-hover:-translate-y-2">
                            <Plus className="h-5 w-5" />
                        </button>
                    </Link>
                </div>

                {/* Folder Tab */}
                <div className="absolute -top-3.5 left-0 bg-stone-100 w-20 h-6 rounded-t-lg rounded-tl-sm border-2 border-stone-200 border-b-0 group-hover:-translate-y-2 duration-200 group-hover:bg-stone-200 group-hover:border-stone-300"></div>

                {/* Folder Body */}
                <div className=" h-46 w-72 bg-stone-100 border-2 border-stone-200 rounded-lg rounded-tl-none p-4 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-2 group-hover:bg-stone-200 group-hover:border-stone-300 relative overflow-hidden">

                    {/* Folder Content */}
                    <div className="h-full flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                                {folderType.name}
                            </h3>
                            <h4 className="text-sm text-gray-600 mb-2">
                                {folderType.description || 'Aucune description'}
                            </h4>
                            <div className="mt-5 flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    <FileText className="h-3 w-3" />{folderType.requiredDocuments.length} document{folderType.requiredDocuments.length > 1 ? 's' : ''} requis
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    const FolderCard = ({ folder }: { folder: FolderWithStatus }) => {
        return (
            <Link href={ROUTES.FOLDERS.DETAIL(folder.id)}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900 truncate">{folder.name}</h3>
                            {getStatusBadge(folder.status)}
                        </div>
                        <p className="text-sm text-gray-500">
                            Envoyé {formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true, locale: fr })} • {folder.requestedDocuments.length} document{folder.requestedDocuments.length > 1 ? 's' : ''}
                        </p>
                    </CardContent>
                </Card>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Types de dossier Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Types de dossier</h1>
                        <Button asChild>
                            <Link href={ROUTES.FOLDER_TYPES.NEW}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau type de dossier
                            </Link>
                        </Button>
                    </div>

                    {isfolderTypesLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : !folderTypes || folderTypes.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Aucun type de dossier
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Créez votre premier type de dossier pour commencer
                                </p>
                                <Button asChild>
                                    <Link href={ROUTES.FOLDER_TYPES.NEW}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Créer un type de dossier
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <ScrollArea className="w-full rounded-md whitespace-nowrap">
                            <div className="flex w-max space-x-4 p-4 pt-6">
                                {folderTypes.map((folderType) => (
                                    <FolderGridItem key={folderType.id} folderType={folderType} />
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </div>
                <div className="border-t border-gray-200 my-12"></div>
                {/* Dossiers en cours Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Dossiers en cours</h2>
                        <Button asChild>
                            <Link href={ROUTES.FOLDERS.NEW}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau dossier
                            </Link>
                        </Button>
                    </div>

                    {/* Search Bar et Filtres */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un dossier ou un type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Badge variant="outline" className="cursor-pointer hover:bg-yellow-50">
                                🕐 En attente
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-green-50">
                                ✅ Terminé
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-red-50">
                                ❌ Refusé
                            </Badge>
                        </div>
                    </div>

                    {/* Dossiers Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : !filteredFolders || filteredFolders.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {folders?.length === 0 ? 'Aucun dossier' : 'Aucun résultat'}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {folders?.length === 0
                                        ? 'Créez votre premier dossier pour commencer'
                                        : 'Aucun dossier ne correspond à votre recherche'
                                    }
                                </p>
                                {folders?.length === 0 && (
                                    <Button asChild>
                                        <Link href={ROUTES.FOLDERS.NEW}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Nouveau dossier
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFolders.map((folder) => (
                                <FolderCard key={folder.id} folder={folder} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}