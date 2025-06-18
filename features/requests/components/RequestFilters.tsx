// features/requests/components/RequestFilters.tsx
'use client';
import { ComputedRequestStatus } from '@/shared/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/shared/components';
import { Filter, CheckCircle, Clock, XCircle, FileCheck } from 'lucide-react';

interface RequestFiltersProps {
  statusFilter: ComputedRequestStatus | 'ALL';
  onStatusFilterChange: (status: ComputedRequestStatus | 'ALL') => void;
  requestsCount: number;
  filteredCount: number;
  statusCounts?: {
    [key in ComputedRequestStatus]: number;
  };
  isMobile?: boolean;
}

export const RequestFilters = ({
  statusFilter,
  onStatusFilterChange,
  requestsCount,
  filteredCount,
  statusCounts,
  isMobile = false,
}: RequestFiltersProps) => {
  const statusOptions = [
    {
      value: 'ALL' as const,
      label: 'Toutes',
      icon: Filter,
      count: requestsCount,
    },
    {
      value: 'PENDING' as const,
      label: 'En attente',
      icon: Clock,
      color: 'text-yellow-600',
      count: statusCounts?.PENDING || 0,
    },
    {
      value: 'ACCEPTED' as const,
      label: 'Acceptées',
      icon: CheckCircle,
      color: 'text-green-600',
      count: statusCounts?.ACCEPTED || 0,
    },
    {
      value: 'REJECTED' as const,
      label: 'Refusées',
      icon: XCircle,
      color: 'text-red-600',
      count: statusCounts?.REJECTED || 0,
    },
    {
      value: 'COMPLETED' as const,
      label: 'Terminées',
      icon: FileCheck,
      color: 'text-blue-600',
      count: statusCounts?.COMPLETED || 0,
    },
  ];

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
            {statusOptions.map(option => {
              const Icon = option.icon;
              const isActive = statusFilter === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => onStatusFilterChange(option.value)}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 mr-2 ${option.color || 'text-gray-500'}`}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-blue-600" />
            Filtres
            {filteredCount < requestsCount && (
              <Badge
                variant="secondary"
                className="ml-2 bg-blue-100 text-blue-800 border-blue-200"
              >
                {filteredCount}
              </Badge>
            )}
          </h3>
        </div>
        <div className="space-y-2">
          {statusOptions.map(option => {
            const Icon = option.icon;
            const isActive = statusFilter === option.value;

            return (
              <button
                key={option.value}
                onClick={() => onStatusFilterChange(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center">
                  <Icon
                    className={`h-4 w-4 mr-3 ${option.color || 'text-gray-500'}`}
                  />
                  <span className="font-medium">{option.label}</span>
                </div>
                {option.count !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    {option.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Stats */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Statistiques</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">
                {requestsCount}
              </div>
              <div className="text-xs text-gray-600 font-medium">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {statusCounts?.PENDING || 0}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                En attente
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {statusCounts?.ACCEPTED || 0}
              </div>
              <div className="text-xs text-gray-600 font-medium">Acceptées</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {statusCounts?.COMPLETED || 0}
              </div>
              <div className="text-xs text-gray-600 font-medium">Terminées</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
