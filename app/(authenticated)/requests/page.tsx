// app/requests/page.tsx
'use client';
import { RequestAccordion } from '@/features/requests/components/RequestAccordion';
import { RequestFilters } from '@/features/requests/components/RequestFilters';
import { RequestSearchAndSort } from '@/features/requests/components/RequestSearchAndSort';
import { useRequests } from '@/features/requests/hooks/useRequests';
import type { ComputedRequestStatus, DocumentRequest } from '@/shared/types';
import { FileText } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function RequestsPage() {
  const { getAllRequests } = useRequests();
  const { data: requests, isLoading, error } = getAllRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    ComputedRequestStatus | 'ALL'
  >('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'email'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getRequestStatus = (
    request: DocumentRequest,
  ): ComputedRequestStatus => {
    if (request.completedAt) return 'COMPLETED';
    if (request.rejectedAt) return 'REJECTED';
    if (request.acceptedAt) return 'ACCEPTED';
    return 'PENDING';
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: loop
  const { filteredAndSortedRequests, statusCounts } = useMemo(() => {
    if (!requests)
      return {
        filteredAndSortedRequests: [],
        statusCounts: { PENDING: 0, ACCEPTED: 0, REJECTED: 0, COMPLETED: 0 },
      };

    const counts = {
      PENDING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      COMPLETED: 0,
    };

    for (const request of requests) {
      const status = getRequestStatus(request);
      counts[status]++;
    }

    const filtered = requests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesEmail = request.email.toLowerCase().includes(searchLower);
      const matchesFolder =
        request.folder?.name.toLowerCase().includes(searchLower) || false;

      const matchesSearch = matchesEmail || matchesFolder;
      const matchesStatus =
        statusFilter === 'ALL' || getRequestStatus(request) === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'status':
          comparison = getRequestStatus(a).localeCompare(getRequestStatus(b));
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return { filteredAndSortedRequests: filtered, statusCounts: counts };
  }, [requests, searchTerm, statusFilter, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--documo-bg-light)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--documo-blue)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--documo-bg-light)]">
        <p className="text-[var(--documo-error)]">Erreur: {error.message}</p>
      </div>
    );
  }

  if (!requests) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--documo-bg-light)]">
        <p className="text-[var(--documo-error)]">
          Erreur: Aucune demande trouvée
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--documo-bg-light)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-[var(--documo-black)] tracking-tight">
            Demandes de documents
          </h1>
          <p className="mt-1 text-sm text-[var(--documo-text-secondary)]">
            {requests.length} demande{requests.length !== 1 ? 's' : ''} au total
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 bg-white p-4 rounded-lg border border-[var(--border)]">
            <div className="sticky top-8 space-y-6">
              <RequestSearchAndSort
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
              />

              <RequestFilters
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                requestsCount={requests.length}
                filteredCount={filteredAndSortedRequests.length}
                statusCounts={statusCounts}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Controls */}
            <div className="lg:hidden mb-6 space-y-4">
              <RequestSearchAndSort
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
              />

              <RequestFilters
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                requestsCount={requests.length}
                filteredCount={filteredAndSortedRequests.length}
                statusCounts={statusCounts}
                isMobile={true}
              />
            </div>

            {/* Results count */}
            {filteredAndSortedRequests.length > 0 &&
              filteredAndSortedRequests.length !== requests.length && (
                <p className="text-sm text-[var(--documo-text-tertiary)] mb-4">
                  {filteredAndSortedRequests.length} résultat
                  {filteredAndSortedRequests.length !== 1 ? 's' : ''}
                </p>
              )}

            {/* Requests List */}
            {filteredAndSortedRequests.length === 0 ? (
              <div className="bg-white rounded-lg border border-[var(--border)] p-12 text-center">
                <FileText className="h-12 w-12 text-[var(--documo-text-tertiary)] mx-auto mb-4" />
                <h3 className="text-base font-medium text-[var(--documo-black)] mb-1">
                  {requests.length === 0 ? 'Aucune demande' : 'Aucun résultat'}
                </h3>
                <p className="text-sm text-[var(--documo-text-secondary)]">
                  {requests.length === 0
                    ? 'Les demandes de documents apparaîtront ici'
                    : 'Essaie de modifier tes critères de recherche'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAndSortedRequests.map((request) => (
                  <RequestAccordion
                    key={request.id}
                    request={request}
                    getRequestStatus={getRequestStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
