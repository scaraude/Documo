// app/folders/page.tsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFolder } from '@/features/folders/hooks/useFolder';
import { useFolderTypes } from '@/features/folder-types';
import { FolderList } from '@/features/folders/components/FolderList';
import { FolderTypeCarousel } from '@/features/folder-types/components/FolderTypeCarousel';
import { ROUTES } from '@/shared/constants';
import { Button, Card, CardContent } from '@/shared/components';
import { Plus, Search, Grid, List, FolderOpen } from 'lucide-react';

export default function FoldersPage() {
    const { folders, isLoaded, isLoading, error, loadFolders, deleteFolder } = useFolder();
    const { folderTypes, isLoaded: typesLoaded } = useFolderTypes();
    const [showStats, setShowStats] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        loadFolders(showStats);
    }, [loadFolders, showStats]);

    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if ((isLoading && !isLoaded) || !typesLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Erreur: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dossiers</h1>
                            <p className="mt-1 text-gray-600">
                                Gérez vos types de dossiers et vos dossiers individuels
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Folder Types Section */}
            <div className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Types de dossiers</h2>
                            <p className="text-gray-600">Modèles disponibles pour créer vos dossiers</p>
                        </div>
                        <Button asChild>
                            <Link href="/folder-types/new">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau type
                            </Link>
                        </Button>
                    </div>

                    {folderTypes.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Aucun type de dossier
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Commencez par créer votre premier type de dossier pour structurer vos demandes
                                </p>
                                <Button asChild>
                                    <Link href="/folder-types/new">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Créer le premier type
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <FolderTypeCarousel folderTypes={folderTypes} />
                    )}
                </div>
            </div>

            {/* My Folders Section */}
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Mes dossiers</h2>
                            <p className="text-gray-600">
                                {folders.length} dossier{folders.length > 1 ? 's' : ''} créé{folders.length > 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowStats(!showStats);
                                    loadFolders(!showStats);
                                }}
                            >
                                {showStats ? 'Masquer les stats' : 'Afficher les stats'}
                            </Button>
                            <Button asChild disabled={folderTypes.length === 0}>
                                <Link href={ROUTES.FOLDERS.NEW}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nouveau dossier
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Search and View Controls */}
                    <div className="flex justify-between items-center mb-6 gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Rechercher un dossier..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Folders List */}
                    {filteredFolders.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {folders.length === 0 ? 'Aucun dossier créé' : 'Aucun résultat'}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {folders.length === 0
                                        ? 'Créez votre premier dossier à partir d\'un type existant'
                                        : 'Aucun dossier ne correspond à votre recherche'
                                    }
                                </p>
                                {folders.length === 0 && (
                                    <>
                                        <Button asChild disabled={folderTypes.length === 0}>
                                            <Link href={ROUTES.FOLDERS.NEW}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Créer un dossier
                                            </Link>
                                        </Button>
                                        {folderTypes.length === 0 && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                Créez d&apos;abord un type de dossier
                                            </p>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className={viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                        }>
                            <FolderList folders={filteredFolders} onDelete={deleteFolder} viewMode={viewMode} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}