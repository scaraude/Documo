// features/requests/components/RequestSearchAndSort.tsx
'use client';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/shared/components';

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

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sortOrder === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par email, dossier..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tri
          </label>
          <div className="flex gap-2">
            {/* Sort By */}
            <select
              value={sortBy}
              onChange={e =>
                onSortByChange(e.target.value as 'date' | 'status' | 'email')
              }
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort Order */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
              }
              className="px-3"
            >
              {getSortIcon()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
