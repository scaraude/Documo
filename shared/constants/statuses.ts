import type { ComputedFolderStatus } from '@/features/folders/types';
import type {
  ComputedDocumentStatus,
  ComputedRequestStatus,
} from '@/shared/types';

type StatusMeta = {
  label: string;
  badgeClass: string;
};

type FilterableStatusMeta = StatusMeta & {
  filterClass: string;
};

export const REQUEST_STATUS_ORDER: ComputedRequestStatus[] = [
  'PENDING',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'REJECTED',
];

export const REQUEST_STATUS_META: Record<ComputedRequestStatus, StatusMeta> = {
  PENDING: {
    label: 'En attente',
    badgeClass: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  },
  ACCEPTED: {
    label: 'Acceptée (attente docs)',
    badgeClass: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  IN_PROGRESS: {
    label: 'En cours',
    badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  COMPLETED: {
    label: 'Terminée',
    badgeClass: 'border-green-200 bg-green-50 text-green-700',
  },
  REJECTED: {
    label: 'Refusée',
    badgeClass: 'border-red-200 bg-red-50 text-red-700',
  },
};

export const DOCUMENT_STATUS_META: Record<ComputedDocumentStatus, StatusMeta> =
  {
    PENDING: {
      label: 'En attente',
      badgeClass: 'border-gray-200 bg-gray-50 text-gray-700',
    },
    UPLOADING: {
      label: 'Téléchargement',
      badgeClass: 'border-blue-200 bg-blue-50 text-blue-700',
    },
    UPLOADED: {
      label: 'Téléchargé',
      badgeClass: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    },
    VALIDATING: {
      label: 'Validation',
      badgeClass: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    },
    VALID: {
      label: 'Validé',
      badgeClass: 'border-green-200 bg-green-50 text-green-700',
    },
    INVALID: {
      label: 'Refusé',
      badgeClass: 'border-red-200 bg-red-50 text-red-700',
    },
    ERROR: {
      label: 'Erreur',
      badgeClass: 'border-red-200 bg-red-50 text-red-700',
    },
  };

export const FOLDER_STATUS_META: Record<
  ComputedFolderStatus,
  FilterableStatusMeta
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
