'use client';
import { useFolders } from '@/features/folders/hooks/useFolders';
import type {
  ComputedFolderStatus,
  FolderWithStatus,
} from '@/features/folders/types';
import { Badge, Button, Card, CardContent } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, FolderOpen, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const STATUS_CONFIG: Record<
  ComputedFolderStatus,
  {
    label: string;
    badgeClass: string;
    filterClass: string;
  }
> = {
  PENDING: {
    label: 'En cours',
    badgeClass:
      'border-[var(--documo-blue)]/25 bg-[var(--documo-blue-light)] text-[var(--documo-blue-deep)]',
    filterClass:
      'data-[active=true]:border-[var(--documo-blue)] data-[active=true]:bg-[var(--documo-blue-light)] data-[active=true]:text-[var(--documo-blue-deep)]',
  },
  COMPLETED: {
    label: 'Terminé',
    badgeClass:
      'border-[var(--documo-success)]/25 bg-[var(--documo-success)]/10 text-[var(--documo-success)]',
    filterClass:
      'data-[active=true]:border-[var(--documo-success)] data-[active=true]:bg-[var(--documo-success)]/10 data-[active=true]:text-[var(--documo-success)]',
  },
  ARCHIVED: {
    label: 'Archivé',
    badgeClass:
      'border-[var(--documo-text-tertiary)]/30 bg-[var(--documo-bg-light)] text-[var(--documo-text-secondary)]',
    filterClass:
      'data-[active=true]:border-[var(--documo-text-secondary)] data-[active=true]:bg-[var(--documo-bg-light)] data-[active=true]:text-[var(--documo-text-secondary)]',
  },
};

export default function FoldersPage() {
  const { getAllFolders } = useFolders();
  const { data: folders, isLoading } = getAllFolders();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<
    ComputedFolderStatus[]
  >([]);

  const toggleFilter = (status: ComputedFolderStatus) => {
    setSelectedFilters((prev) =>
      prev.includes(status)
        ? prev.filter((value) => value !== status)
        : [...prev, status],
    );
  };

  const filteredFolders =
    folders
      ?.filter((folder) => {
        const searchValue = searchTerm.trim().toLowerCase();
        const matchesSearch =
          searchValue.length === 0 ||
          folder.name.toLowerCase().includes(searchValue) ||
          folder.description.toLowerCase().includes(searchValue);

        const matchesFilter =
          selectedFilters.length === 0 ||
          selectedFilters.includes(folder.status);

        return matchesSearch && matchesFilter;
      })
      .sort(
        (a, b) =>
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime(),
      ) || [];

  const totalFolders = folders?.length || 0;
  const activeSearchOrFilters =
    searchTerm.length > 0 || selectedFilters.length > 0;

  const getStatusBadge = (status: ComputedFolderStatus) => (
    <Badge variant="outline" className={STATUS_CONFIG[status].badgeClass}>
      {STATUS_CONFIG[status].label}
    </Badge>
  );

  const FolderListRow = ({ folder }: { folder: FolderWithStatus }) => (
    <li className="border-b border-[var(--border)] last:border-b-0">
      <Link
        href={ROUTES.FOLDERS.DETAIL(folder.id)}
        className="block p-4 md:p-5 hover:bg-[var(--documo-bg-light)]/60 transition-colors"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-medium text-[var(--documo-black)] truncate">
              {folder.name}
            </h2>
            {folder.description && (
              <p className="mt-1 text-sm text-[var(--documo-text-secondary)] line-clamp-1">
                {folder.description}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--documo-text-tertiary)]">
              <span>
                Créé{' '}
                {formatDistanceToNow(new Date(folder.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
              <span className="inline-flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {folder.requestedDocuments.length} document
                {folder.requestedDocuments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="shrink-0">{getStatusBadge(folder.status)}</div>
        </div>
      </Link>
    </li>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--documo-bg-light)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--documo-blue)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--documo-bg-light)]">
      <header className="bg-white border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--documo-black)] tracking-tight">
                Dossiers en cours
              </h1>
              <p className="mt-1 text-sm text-[var(--documo-text-secondary)]">
                {totalFolders} dossier{totalFolders !== 1 ? 's' : ''}
              </p>
            </div>
            <Button asChild>
              <Link href={ROUTES.FOLDERS.NEW}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau dossier
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--documo-text-tertiary)]" />
            <label htmlFor="folders-search" className="sr-only">
              Rechercher un dossier
            </label>
            <input
              id="folders-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher un dossier..."
              className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--documo-blue)] focus:border-[var(--documo-blue)] bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(STATUS_CONFIG) as ComputedFolderStatus[]).map(
              (status) => {
                const isActive = selectedFilters.includes(status);
                return (
                  <Button
                    key={status}
                    type="button"
                    size="sm"
                    variant="outline"
                    data-active={isActive}
                    onClick={() => toggleFilter(status)}
                    className={STATUS_CONFIG[status].filterClass}
                  >
                    {STATUS_CONFIG[status].label}
                  </Button>
                );
              },
            )}
            {selectedFilters.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setSelectedFilters([])}
                className="text-[var(--documo-text-secondary)]"
              >
                Effacer les filtres
              </Button>
            )}
          </div>
        </div>

        {activeSearchOrFilters && (
          <p className="text-sm text-[var(--documo-text-tertiary)] mb-4">
            {filteredFolders.length} résultat
            {filteredFolders.length !== 1 ? 's' : ''}
            {filteredFolders.length !== totalFolders && ` sur ${totalFolders}`}
          </p>
        )}

        {totalFolders === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="h-12 w-12 text-[var(--documo-text-tertiary)] mx-auto mb-4" />
              <h3 className="text-base font-medium text-[var(--documo-black)] mb-1">
                Aucun dossier
              </h3>
              <p className="text-sm text-[var(--documo-text-secondary)] mb-6">
                Créez votre premier dossier pour démarrer votre suivi.
              </p>
              <Button asChild>
                <Link href={ROUTES.FOLDERS.NEW}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau dossier
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : filteredFolders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="h-12 w-12 text-[var(--documo-text-tertiary)] mx-auto mb-4" />
              <h3 className="text-base font-medium text-[var(--documo-black)] mb-1">
                Aucun résultat
              </h3>
              <p className="text-sm text-[var(--documo-text-secondary)] mb-6">
                Aucun dossier ne correspond aux filtres actuels.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilters([]);
                }}
              >
                Réinitialiser la recherche
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="py-0">
            <CardContent className="p-0">
              <ul>
                {filteredFolders.map((folder) => (
                  <FolderListRow key={folder.id} folder={folder} />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
