// app/requests/page.tsx
'use client';
import { RequestAccordion } from '@/features/requests/components/RequestAccordion';
import { RequestFilters } from '@/features/requests/components/RequestFilters';
import { RequestSearchAndSort } from '@/features/requests/components/RequestSearchAndSort';
import { useRequests } from '@/features/requests/hooks/useRequests';
import { Card, CardContent } from '@/shared/components';
import { ComputedRequestStatus, DocumentRequest } from '@/shared/types';
import { FileX } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function RequestsPage() {
  const { getAllRequests } = useRequests();
  const { data: requests, isLoading, error } = getAllRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    ComputedRequestStatus | 'ALL'
  >('PENDING');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'email'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getRequestStatus = (
    request: DocumentRequest
  ): ComputedRequestStatus => {
    if (request.completedAt) return 'COMPLETED';
    if (request.rejectedAt) return 'REJECTED';
    if (request.acceptedAt) return 'ACCEPTED';
    return 'PENDING';
  };

  const { filteredAndSortedRequests, statusCounts } = useMemo(() => {
    if (!requests)
      return {
        filteredAndSortedRequests: [],
        statusCounts: { PENDING: 0, ACCEPTED: 0, REJECTED: 0, COMPLETED: 0 },
      };

    // Calculate status counts
    const counts = {
      PENDING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      COMPLETED: 0,
    };

    requests.forEach(request => {
      const status = getRequestStatus(request);
      counts[status]++;
    });

    // Filter requests
    const filtered = requests.filter(request => {
      const matchesSearch = request.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' || getRequestStatus(request) === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort requests
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

  if (!requests) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Erreur: Aucune demande trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Demandes
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                {requests.length} demande{requests.length > 1 ? 's' : ''} au
                total
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => setStatusFilter('COMPLETED')}
                className={`text-center p-3 rounded-lg transition-all duration-200 ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-blue-50 border-2 border-blue-100 shadow-sm'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="text-2xl font-bold text-blue-600">
                  {statusCounts.COMPLETED}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Terminées
                </div>
              </button>
              <button
                onClick={() => setStatusFilter('ACCEPTED')}
                className={`text-center p-3 rounded-lg transition-all duration-200 ${
                  statusFilter === 'ACCEPTED'
                    ? 'bg-green-50 border-2 border-green-100 shadow-sm'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="text-2xl font-bold text-green-600">
                  {statusCounts.ACCEPTED}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Acceptées
                </div>
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`text-center p-3 rounded-lg transition-all duration-200 ${
                  statusFilter === 'PENDING'
                    ? 'bg-yellow-50 border-2 border-yellow-100 shadow-sm'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="text-2xl font-bold text-yellow-600">
                  {statusCounts.PENDING}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  En attente
                </div>
              </button>
              <button
                onClick={() => setStatusFilter('REJECTED')}
                className={`text-center p-3 rounded-lg transition-all duration-200 ${
                  statusFilter === 'REJECTED'
                    ? 'bg-red-50 border-2 border-red-100 shadow-sm'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="text-2xl font-bold text-red-600">
                  {statusCounts.REJECTED}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Refusées
                </div>
              </button>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`text-center p-3 rounded-lg transition-all duration-200 ${
                  statusFilter === 'ALL'
                    ? 'bg-gray-50 border-2 border-gray-100 shadow-sm'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="text-2xl font-bold text-gray-600">
                  {requests.length}
                </div>
                <div className="text-sm text-gray-500 font-medium">Toutes</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-6 space-y-4">
              {/* Search and Sort */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <RequestSearchAndSort
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  sortOrder={sortOrder}
                  onSortOrderChange={setSortOrder}
                />
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <RequestFilters
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  requestsCount={requests.length}
                  filteredCount={filteredAndSortedRequests.length}
                  statusCounts={statusCounts}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Search and Filters */}
            <div className="lg:hidden mb-4 space-y-4">
              {/* Mobile Search and Sort */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <RequestSearchAndSort
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  sortOrder={sortOrder}
                  onSortOrderChange={setSortOrder}
                />
              </div>

              {/* Mobile Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <RequestFilters
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  requestsCount={requests.length}
                  filteredCount={filteredAndSortedRequests.length}
                  statusCounts={statusCounts}
                  isMobile={true}
                />
              </div>
            </div>

            {/* Requests List */}
            {filteredAndSortedRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <Card className="text-center py-16 bg-transparent border-0 shadow-none">
                  <CardContent>
                    <FileX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {requests.length === 0
                        ? 'Aucune demande'
                        : 'Aucun résultat'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {requests.length === 0
                        ? 'Créez votre première demande de documents'
                        : 'Aucune demande ne correspond à vos critères'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="overflow-hidden">
                {filteredAndSortedRequests.map(request => (
                  <div
                    key={request.id}
                    className={`bg-white border border-gray-200 rounded-xl`}
                  >
                    <RequestAccordion
                      request={request}
                      getRequestStatus={getRequestStatus}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
