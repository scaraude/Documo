// features/requests/components/RequestSearchAndSort.tsx
'use client';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';

interface RequestSearchAndSortProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: 'date' | 'status' | 'email';
  onSortByChange: (sortBy: 'date' | 'status' | 'email') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export const RequestSearchAndSort = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: RequestSearchAndSortProps) => {
  const sortOptions = [
    { value: 'date' as const, label: 'Date' },
    { value: 'status' as const, label: 'Statut' },
    { value: 'email' as const, label: 'Email' },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <label
          htmlFor="search-input"
          className="block text-xs font-medium text-[var(--documo-text-tertiary)] uppercase tracking-wide mb-2"
        >
          Rechercher
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--documo-text-tertiary)]" />
          <input
            id="search-input"
            type="text"
            placeholder="Email, dossier..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[var(--border)] rounded-md text-sm text-[var(--documo-black)] placeholder:text-[var(--documo-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--documo-blue)] focus:ring-offset-1 transition-shadow"
          />
        </div>
      </div>

      {/* Sort Controls */}
      <div>
        <label
          htmlFor="sort-by"
          className="block text-xs font-medium text-[var(--documo-text-tertiary)] uppercase tracking-wide mb-2"
        >
          Trier par
        </label>
        <div className="flex gap-2">
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) =>
              onSortByChange(e.target.value as 'date' | 'status' | 'email')
            }
            className="flex-1 px-3 py-2 bg-white border border-[var(--border)] rounded-md text-sm text-[var(--documo-black)] focus:outline-none focus:ring-2 focus:ring-[var(--documo-blue)] focus:ring-offset-1 transition-shadow"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
            }
            className="px-3 py-2 bg-white border border-[var(--border)] rounded-md text-[var(--documo-text-secondary)] hover:bg-[var(--documo-bg-light)] focus:outline-none focus:ring-2 focus:ring-[var(--documo-blue)] focus:ring-offset-1 transition-all"
            aria-label={sortOrder === 'asc' ? 'Tri décroissant' : 'Tri croissant'}
          >
            {sortOrder === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
