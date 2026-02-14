'use client';
import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { useFolderTypes } from '@/features/folder-types';
import { Badge, Button, Card, CardContent } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import {
  Edit2,
  FileText,
  FolderOpen,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function FolderTypesPage() {
  const { getAllFolderTypes, deleteFolderTypeMutation } = useFolderTypes();
  const { data: folderTypes, isLoading } = getAllFolderTypes();
  const { getLabel } = useDocumentTypes();

  const [searchTerm, setSearchTerm] = useState('');
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const filteredFolderTypes = folderTypes?.filter((ft) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ft.name.toLowerCase().includes(searchLower) ||
      ft.description?.toLowerCase().includes(searchLower)
    );
  });

  const handleArchive = async (id: string, name: string) => {
    if (
      window.confirm(
        `Archiver le modèle de dossier "${name}" ? Il ne sera plus disponible pour les nouveaux dossiers.`,
      )
    ) {
      setArchivingId(id);
      try {
        await deleteFolderTypeMutation.mutateAsync({ id });
      } finally {
        setArchivingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--documo-bg-light)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--documo-blue)] border-t-transparent" />
      </div>
    );
  }

  const totalFolderTypes = folderTypes?.length || 0;
  const visibleFolderTypes = filteredFolderTypes || [];

  return (
    <div className="min-h-screen bg-[var(--documo-bg-light)]">
      <header className="bg-white border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--documo-black)] tracking-tight">
                Modèles de dossier
              </h1>
              <p className="mt-1 text-sm text-[var(--documo-text-secondary)]">
                {totalFolderTypes} modèle{totalFolderTypes !== 1 ? 's' : ''} de
                dossier
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={ROUTES.FOLDERS.HOME}>Voir les dossiers</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.FOLDER_TYPES.NEW}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau modèle
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--documo-text-tertiary)]" />
            <label htmlFor="folder-types-search" className="sr-only">
              Rechercher un modèle de dossier
            </label>
            <input
              id="folder-types-search"
              type="text"
              placeholder="Rechercher un modèle de dossier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--documo-blue)] focus:border-[var(--documo-blue)] bg-white"
            />
          </div>
        </div>

        {!!searchTerm && (
          <p className="text-sm text-[var(--documo-text-tertiary)] mb-4">
            {visibleFolderTypes.length} résultat
            {visibleFolderTypes.length !== 1 ? 's' : ''}
          </p>
        )}

        {totalFolderTypes === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="h-12 w-12 text-[var(--documo-text-tertiary)] mx-auto mb-4" />
              <h3 className="text-base font-medium text-[var(--documo-black)] mb-1">
                Aucun modèle de dossier
              </h3>
              <p className="text-sm text-[var(--documo-text-secondary)] mb-6">
                Créez un modèle de dossier pour structurer vos demandes
                documentaires.
              </p>
              <Button asChild>
                <Link href={ROUTES.FOLDER_TYPES.NEW}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un modèle de dossier
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : visibleFolderTypes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="h-12 w-12 text-[var(--documo-text-tertiary)] mx-auto mb-4" />
              <h3 className="text-base font-medium text-[var(--documo-black)] mb-1">
                Aucun résultat
              </h3>
              <p className="text-sm text-[var(--documo-text-secondary)] mb-6">
                Essayez de modifier votre recherche.
              </p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Effacer la recherche
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleFolderTypes.map((folderType) => (
              <Card
                key={folderType.id}
                className="py-0 overflow-hidden border-[var(--border)] shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-2 rounded-lg bg-[var(--documo-blue-light)]">
                      <FolderOpen className="h-5 w-5 text-[var(--documo-blue)]" />
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="bg-[var(--documo-blue)] hover:bg-[var(--documo-blue-deep)] text-white"
                    >
                      <Link
                        href={`${ROUTES.FOLDERS.NEW}?typeId=${folderType.id}`}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Nouveau dossier
                      </Link>
                    </Button>
                  </div>

                  <h2 className="mt-4 text-base font-semibold text-[var(--documo-black)]">
                    {folderType.name}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--documo-text-secondary)] min-h-10">
                    {folderType.description || 'Aucune description'}
                  </p>

                  <div className="mt-3 text-xs text-[var(--documo-text-tertiary)] inline-flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    {folderType.requiredDocuments.length} document
                    {folderType.requiredDocuments.length !== 1 ? 's' : ''}{' '}
                    requis
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {folderType.requiredDocuments.slice(0, 3).map((doc) => (
                      <Badge
                        key={doc.id}
                        variant="outline"
                        className="text-xs border-[var(--documo-blue)]/25 bg-[var(--documo-blue-light)]/40 text-[var(--documo-black)]"
                      >
                        {getLabel(doc)}
                      </Badge>
                    ))}
                    {folderType.requiredDocuments.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-[var(--border)] text-[var(--documo-text-secondary)]"
                      >
                        +{folderType.requiredDocuments.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button variant="outline" asChild>
                      <Link href={ROUTES.FOLDER_TYPES.EDIT(folderType.id)}>
                        <Edit2 className="h-4 w-4 mr-1" />
                        Modifier
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleArchive(folderType.id, folderType.name)
                      }
                      disabled={
                        archivingId === folderType.id ||
                        deleteFolderTypeMutation.isPending
                      }
                      className="border-[var(--documo-error)]/25 text-[var(--documo-error)] hover:bg-[var(--documo-error)]/5 hover:text-[var(--documo-error)]"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {archivingId === folderType.id ? '...' : 'Archiver'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
