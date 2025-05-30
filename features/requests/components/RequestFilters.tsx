// features/requests/components/RequestFilters.tsx
'use client'
import { ComputedRequestStatus } from '@/shared/types'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/components'
import { Filter, CheckCircle, Clock, XCircle, FileCheck } from 'lucide-react'

interface RequestFiltersProps {
    statusFilter: ComputedRequestStatus | 'ALL'
    onStatusFilterChange: (status: ComputedRequestStatus | 'ALL') => void
    requestsCount: number
    filteredCount: number
    isMobile?: boolean
}

export const RequestFilters = ({
    statusFilter,
    onStatusFilterChange,
    requestsCount,
    filteredCount,
    isMobile = false
}: RequestFiltersProps) => {
    const statusOptions = [
        { value: 'ALL' as const, label: 'Toutes', icon: Filter, count: requestsCount },
        { value: 'PENDING' as const, label: 'En attente', icon: Clock, color: 'text-yellow-600' },
        { value: 'ACCEPTED' as const, label: 'Acceptées', icon: CheckCircle, color: 'text-green-600' },
        { value: 'REJECTED' as const, label: 'Refusées', icon: XCircle, color: 'text-red-600' },
        { value: 'COMPLETED' as const, label: 'Terminées', icon: FileCheck, color: 'text-blue-600' }
    ]

    if (isMobile) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtres
                        {filteredCount < requestsCount && (
                            <Badge variant="secondary" className="ml-2">
                                {filteredCount}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => {
                            const Icon = option.icon
                            const isActive = statusFilter === option.value

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => onStatusFilterChange(option.value)}
                                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 mr-2 ${option.color || 'text-gray-500'}`} />
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtres
                        {filteredCount < requestsCount && (
                            <Badge variant="secondary" className="ml-2">
                                {filteredCount}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {statusOptions.map((option) => {
                        const Icon = option.icon
                        const isActive = statusFilter === option.value

                        return (
                            <button
                                key={option.value}
                                onClick={() => onStatusFilterChange(option.value)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md text-sm transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <Icon className={`h-4 w-4 mr-3 ${option.color || 'text-gray-500'}`} />
                                    <span className="font-medium">{option.label}</span>
                                </div>
                                {option.count !== undefined && (
                                    <Badge variant="outline" className="text-xs">
                                        {option.count}
                                    </Badge>
                                )}
                            </button>
                        )
                    })}
                </CardContent>
            </Card>

            {/* Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total</span>
                        <span className="font-medium">{requestsCount}</span>
                    </div>
                    {filteredCount < requestsCount && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Filtrées</span>
                            <span className="font-medium text-blue-600">{filteredCount}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}