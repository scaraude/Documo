// features/requests/components/RequestFilters.tsx
'use client';
import type { ComputedRequestStatus } from '@/shared/types';

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
  statusCounts,
  isMobile = false,
}: RequestFiltersProps) => {
  const statusOptions = [
    {
      value: 'ALL' as const,
      label: 'Toutes',
    },
    {
      value: 'PENDING' as const,
      label: 'En attente',
      count: statusCounts?.PENDING || 0,
    },
    {
      value: 'ACCEPTED' as const,
      label: 'Acceptées',
      count: statusCounts?.ACCEPTED || 0,
    },
    {
      value: 'COMPLETED' as const,
      label: 'Terminées',
      count: statusCounts?.COMPLETED || 0,
    },
    {
      value: 'REJECTED' as const,
      label: 'Refusées',
      count: statusCounts?.REJECTED || 0,
    },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => {
          const isActive = statusFilter === option.value;

          return (
            <button
              type="button"
              key={option.value}
              onClick={() => onStatusFilterChange(option.value)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--documo-blue-light)] text-[var(--documo-blue)] font-medium'
                  : 'text-[var(--documo-text-secondary)] hover:bg-[var(--documo-bg-light)]'
              }`}
            >
              {option.label}
              {option.count !== undefined && (
                <span
                  className={`text-xs ${isActive ? 'text-[var(--documo-blue)]' : 'text-[var(--documo-text-tertiary)]'}`}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs font-medium text-[var(--documo-text-tertiary)] uppercase tracking-wide mb-3">
        Statut
      </h3>
      <div className="space-y-1">
        {statusOptions.map((option) => {
          const isActive = statusFilter === option.value;

          return (
            <button
              type="button"
              key={option.value}
              onClick={() => onStatusFilterChange(option.value)}
              className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--documo-blue-light)] text-[var(--documo-blue)] font-medium'
                  : 'text-[var(--documo-text-secondary)] hover:bg-[var(--documo-bg-light)]'
              }`}
            >
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span
                  className={`text-xs tabular-nums ${isActive ? 'text-[var(--documo-blue)]' : 'text-[var(--documo-text-tertiary)]'}`}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
