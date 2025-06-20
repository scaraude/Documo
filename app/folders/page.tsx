'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, FileText, FolderOpen } from 'lucide-react';
import { FolderType, useFolderTypes } from '../../features/folder-types';
import { useFolders } from '../../features/folders/hooks/useFolders';
import {
  Button,
  Card,
  CardContent,
  Badge,
  ScrollArea,
  ScrollBar,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ComputedFolderStatus,
  FolderWithStatus,
} from '../../features/folders/types';
import { useRouter } from 'next/navigation';
import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';

export default function FoldersPage() {
  const { getAllFolderTypes } = useFolderTypes();
  const { data: folderTypes, isLoading: isfolderTypesLoading } =
    getAllFolderTypes();
  const { getAllFolders } = useFolders();
  const { data: folders, isLoading } = getAllFolders();
  const { getLabel } = useDocumentTypes();

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<
    ComputedFolderStatus[]
  >([]);

  const toggleFilter = (status: ComputedFolderStatus) => {
    setSelectedFilters(prev => {
      if (prev.includes(status)) {
        return prev.filter(f => f !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const filteredFolders = folders?.filter(folder => {
    const matchesSearch = folder.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilters.length === 0 || selectedFilters.includes(folder.status);
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: ComputedFolderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">🕐 En attente</Badge>
        );
      case 'COMPLETED':
        return (
          <Badge className="bg-green-100 text-green-800">✅ Terminé</Badge>
        );
      case 'ARCHIVED':
        return <Badge className="bg-red-100 text-red-800">❌ Refusé</Badge>;
      default:
        const never: never = status;
        return never;
    }
  };

  const FolderGridItem = ({
    folderType,
  }: {
    folderType: FolderType & {
      foldersCount?: number;
      activeFoldersCount?: number;
    };
  }) => {
    const groupTransition = 'group-hover:-translate-y-3 duration-300';
    return (
      <div
        className="group cursor-pointer"
        onClick={() => router.push(ROUTES.FOLDER_TYPES.DETAIL(folderType.id))}
      >
        {/* Folder Representation */}
        <div className="relative">
          <div className="absolute bottom-4 right-4 z-50 group/button">
            <Link
              href={`${ROUTES.FOLDERS.NEW}?typeId=${folderType.id}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                {/* Tooltip */}
                <div
                  className={`absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover/button:opacity-100 transform scale-95 group-hover/button:scale-100 transition-all pointer-events-none whitespace-nowrap z-60 ${groupTransition}`}
                >
                  Créer un dossier
                  <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
                <button
                  className={`w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl ${groupTransition}`}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </Link>
          </div>

          {/* Folder Tab */}
          <div
            className={`absolute -top-3.5 left-0 bg-white w-24 h-7 rounded-t-lg rounded-tl-sm border-2 border-gray-200 border-b-0 group-hover:bg-gray-50 group-hover:border-blue-300 ${groupTransition}`}
          ></div>

          {/* Folder Body */}
          <div
            className={`h-48 w-80 md:w-80 sm:w-72 bg-white border-2 border-gray-200 rounded-lg rounded-tl-none p-5 transition-all duration-300 group-hover:shadow-xl group-hover:bg-gray-50 group-hover:border-blue-300 relative overflow-hidden ${groupTransition}`}
          >
            {/* Folder Content */}
            <div className="h-full flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                  {folderType.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3 leading-relaxed">
                  {folderType.description || 'Aucune description'}
                </p>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Documents requis:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {folderType.requiredDocuments
                      .slice(0, 2)
                      .map((doc, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {getLabel(doc.id)}
                        </Badge>
                      ))}
                    {folderType.requiredDocuments.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 bg-gray-50"
                      >
                        +{folderType.requiredDocuments.length - 2}
                      </Badge>
                    )}
                  </div>
                  {folderType.foldersCount !== undefined && (
                    <p className="text-xs text-gray-500 mt-2">
                      {folderType.foldersCount} dossier
                      {folderType.foldersCount !== 1 ? 's' : ''} créé
                      {folderType.foldersCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FolderCard = ({ folder }: { folder: FolderWithStatus }) => {
    return (
      <Link href={ROUTES.FOLDERS.DETAIL(folder.id)}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 truncate">
                {folder.name}
              </h3>
              {getStatusBadge(folder.status)}
            </div>
            <p className="text-sm text-gray-500">
              Envoyé{' '}
              {formatDistanceToNow(new Date(folder.createdAt), {
                addSuffix: true,
                locale: fr,
              })}{' '}
              • {folder.requestedDocuments.length} document
              {folder.requestedDocuments.length > 1 ? 's' : ''}
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Types de dossier
            </h1>
            <Button
              asChild
              size="lg"
              className="font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href={ROUTES.FOLDER_TYPES.NEW}>
                <Plus className="h-5 w-5" />
                <FolderOpen className="h-5 w-5" />
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
            <>
              {/* Desktop: Horizontal scroll */}
              <div className="hidden md:block">
                <ScrollArea className="w-full rounded-md whitespace-nowrap">
                  <div className="flex w-max space-x-6 p-4 pt-7">
                    {folderTypes.map(folderType => (
                      <FolderGridItem
                        key={folderType.id}
                        folderType={folderType}
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              {/* Mobile: Vertical grid */}
              <div className="md:hidden">
                <div className="grid grid-cols-1 gap-4 p-6">
                  {folderTypes.map(folderType => (
                    <FolderGridItem
                      key={folderType.id}
                      folderType={folderType}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="border-t border-gray-200 my-12"></div>
        {/* Dossiers en cours Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Dossiers en cours
            </h2>
            <Button
              asChild
              size="lg"
              className="font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
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
                placeholder="Rechercher un dossier..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Badge
                variant={
                  selectedFilters.includes('PENDING') ? 'default' : 'outline'
                }
                className={`h-8 cursor-pointer transition-colors ${
                  selectedFilters.includes('PENDING')
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'hover:bg-yellow-50'
                }`}
                onClick={() => toggleFilter('PENDING')}
              >
                🕐 En attente
              </Badge>
              <Badge
                variant={
                  selectedFilters.includes('COMPLETED') ? 'default' : 'outline'
                }
                className={`h-8 cursor-pointer transition-colors ${
                  selectedFilters.includes('COMPLETED')
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'hover:bg-green-50'
                }`}
                onClick={() => toggleFilter('COMPLETED')}
              >
                ✅ Terminé
              </Badge>
              <Badge
                variant={
                  selectedFilters.includes('ARCHIVED') ? 'default' : 'outline'
                }
                className={`h-8 cursor-pointer transition-colors ${
                  selectedFilters.includes('ARCHIVED')
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'hover:bg-red-50'
                }`}
                onClick={() => toggleFilter('ARCHIVED')}
              >
                ❌ Refusé
              </Badge>
              {selectedFilters.length > 0 && (
                <button
                  onClick={() => setSelectedFilters([])}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Effacer les filtres ({selectedFilters.length})
                </button>
              )}
            </div>
          </div>

          {/* Results counter */}
          {filteredFolders && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredFolders.length} dossier
                {filteredFolders.length !== 1 ? 's' : ''}
                {selectedFilters.length > 0 || searchTerm ? ' trouvé' : ''}
                {filteredFolders.length !== 1 &&
                (selectedFilters.length > 0 || searchTerm)
                  ? 's'
                  : ''}
                {folders &&
                  filteredFolders.length !== folders.length &&
                  ` sur ${folders.length}`}
              </p>
            </div>
          )}

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
                    : selectedFilters.length > 0
                      ? 'Aucun dossier ne correspond aux filtres sélectionnés'
                      : 'Aucun dossier ne correspond à votre recherche'}
                </p>
                {folders?.length === 0 ? (
                  <Button asChild>
                    <Link href={ROUTES.FOLDERS.NEW}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau dossier
                    </Link>
                  </Button>
                ) : selectedFilters.length > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFilters([])}
                  >
                    Effacer les filtres
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFolders.map(folder => (
                <FolderCard key={folder.id} folder={folder} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
