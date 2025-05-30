// app/requests/page.tsx
'use client'
import { useState, useMemo } from 'react'
import { useRequest } from '@/features/requests/hooks/useRequest'
import { RequestAccordion } from '@/features/requests/components/RequestAccordion'
import { RequestFilters } from '@/features/requests/components/RequestFilters'
import { RequestSearchAndSort } from '@/features/requests/components/RequestSearchAndSort'
import { Card, CardContent, Button } from '@/shared/components'
import { DocumentRequest, ComputedRequestStatus } from '@/shared/types'
import { Plus, FileX } from 'lucide-react'
import { ROUTES } from '@/shared/constants'
import Link from 'next/link'

export default function RequestsPage() {
    const { requests, isLoaded, isLoading, error } = useRequest()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<ComputedRequestStatus | 'ALL'>('ALL')
    const [sortBy, setSortBy] = useState<'date' | 'status' | 'civilId'>('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    const filteredAndSortedRequests = useMemo(() => {
        const filtered = requests.filter(request => {
            const matchesSearch = request.civilId.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'ALL' || getRequestStatus(request) === statusFilter
            return matchesSearch && matchesStatus
        })

        // Sorting
        filtered.sort((a, b) => {
            let comparison = 0

            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    break
                case 'civilId':
                    comparison = a.civilId.localeCompare(b.civilId)
                    break
                case 'status':
                    comparison = getRequestStatus(a).localeCompare(getRequestStatus(b))
                    break
            }

            return sortOrder === 'asc' ? comparison : -comparison
        })

        return filtered
    }, [requests, searchTerm, statusFilter, sortBy, sortOrder])

    const getRequestStatus = (request: DocumentRequest): ComputedRequestStatus => {
        if (request.completedAt) return 'COMPLETED'
        if (request.rejectedAt) return 'REJECTED'
        if (request.acceptedAt) return 'ACCEPTED'
        return 'PENDING'
    }

    if (isLoading && !isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Erreur: {error.message}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Demandes</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                {requests.length} demande{requests.length > 1 ? 's' : ''} au total
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={ROUTES.REQUESTS.NEW}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvelle demande
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <RequestFilters
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            requestsCount={requests.length}
                            filteredCount={filteredAndSortedRequests.length}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Search and Sort */}
                        <div className="mb-6">
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
                        <div className="lg:hidden mb-4">
                            <RequestFilters
                                statusFilter={statusFilter}
                                onStatusFilterChange={setStatusFilter}
                                requestsCount={requests.length}
                                filteredCount={filteredAndSortedRequests.length}
                                isMobile={true}
                            />
                        </div>

                        {/* Requests List */}
                        {filteredAndSortedRequests.length === 0 ? (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <FileX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {requests.length === 0 ? 'Aucune demande' : 'Aucun résultat'}
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        {requests.length === 0
                                            ? 'Créez votre première demande de documents'
                                            : 'Aucune demande ne correspond à vos critères'
                                        }
                                    </p>
                                    {requests.length === 0 && (
                                        <Button asChild>
                                            <Link href={ROUTES.REQUESTS.NEW}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Nouvelle demande
                                            </Link>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
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
            </div>
        </div>
    )
}