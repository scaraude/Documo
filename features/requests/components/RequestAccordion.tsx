'use client';
import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { ShareLinkButton } from '@/features/external-requests/components/ShareLinkButton';
import { Button } from '@/shared/components';
import type {
  ComputedRequestStatus,
  DocumentRequest,
  DocumentRequestWithFolder,
} from '@/shared/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ROUTES } from '../../../shared/constants';

interface RequestAccordionProps {
  request: DocumentRequestWithFolder;
  getRequestStatus: (request: DocumentRequest) => ComputedRequestStatus;
}

export const RequestAccordion = ({
  request,
  getRequestStatus,
}: RequestAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getLabelById } = useDocumentTypes();
  const status = getRequestStatus(request);

  const getStatusStyle = (status: ComputedRequestStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-[var(--documo-warning)]/10 text-[var(--documo-warning)]';
      case 'ACCEPTED':
        return 'bg-[var(--documo-success)]/10 text-[var(--documo-success)]';
      case 'REJECTED':
        return 'bg-[var(--documo-error)]/10 text-[var(--documo-error)]';
      case 'COMPLETED':
        return 'bg-[var(--documo-blue-light)] text-[var(--documo-blue)]';
      default:
        return 'bg-[var(--documo-bg-light)] text-[var(--documo-text-secondary)]';
    }
  };

  const getStatusLabel = (status: ComputedRequestStatus) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'ACCEPTED':
        return 'Acceptée';
      case 'REJECTED':
        return 'Refusée';
      case 'COMPLETED':
        return 'Terminée';
      default:
        return status;
    }
  };

  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <button
        type="button"
        className="w-full px-4 py-3 flex items-center gap-4 text-left hover:bg-[var(--documo-bg-light)]/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Chevron */}
        <span className="text-[var(--documo-text-tertiary)]">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>

        {/* Email */}
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-[var(--documo-black)] truncate">
            {request.folder.name}

          </span>
          {request.folder && (
            <span className="flex items-center gap-1 text-xs text-[var(--documo-text-tertiary)] mt-0.5">
              <FolderOpen className="h-3 w-3" />
              {request.email}
            </span>
          )}
        </span>

        {/* Documents count */}
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--documo-text-secondary)]">
          <FileText className="h-3.5 w-3.5" />
          {request.requestedDocumentIds.length} document{request.requestedDocumentIds.length !== 1 ? 's' : ''}
        </span>

        {/* Time */}
        <span className="hidden md:block text-xs text-[var(--documo-text-tertiary)] tabular-nums">
          {formatRelativeTime(request.createdAt)}
        </span>

        {/* Status */}
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusStyle(status)}`}
        >
          {getStatusLabel(status)}
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[var(--border)] bg-[var(--documo-bg-light)]/30 px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Details */}
            <div className="space-y-4">
              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--documo-text-tertiary)]">
                    Créée le
                  </span>
                  <span className="text-[var(--documo-black)]">
                    {formatDate(request.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--documo-text-tertiary)]">
                    Expire le
                  </span>
                  <span className="text-[var(--documo-black)]">
                    {formatDate(request.expiresAt)}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-[var(--documo-text-tertiary)] uppercase tracking-wide">
                  Historique
                </h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--documo-text-tertiary)]" />
                    <span className="text-[var(--documo-text-secondary)]">
                      Créée
                    </span>
                    <span className="ml-auto text-[var(--documo-text-tertiary)] text-xs">
                      {formatRelativeTime(request.createdAt)}
                    </span>
                  </div>
                  {request.acceptedAt && (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--documo-success)]" />
                      <span className="text-[var(--documo-text-secondary)]">
                        Acceptée
                      </span>
                      <span className="ml-auto text-[var(--documo-text-tertiary)] text-xs">
                        {formatRelativeTime(request.acceptedAt)}
                      </span>
                    </div>
                  )}
                  {request.rejectedAt && (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--documo-error)]" />
                      <span className="text-[var(--documo-text-secondary)]">
                        Refusée
                      </span>
                      <span className="ml-auto text-[var(--documo-text-tertiary)] text-xs">
                        {formatRelativeTime(request.rejectedAt)}
                      </span>
                    </div>
                  )}
                  {request.completedAt && (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--documo-blue)]" />
                      <span className="text-[var(--documo-text-secondary)]">
                        Terminée
                      </span>
                      <span className="ml-auto text-[var(--documo-text-tertiary)] text-xs">
                        {formatRelativeTime(request.completedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Documents & Actions */}
            <div className="space-y-4">
              {/* Documents */}
              <div>
                <h4 className="text-xs font-medium text-[var(--documo-text-tertiary)] uppercase tracking-wide mb-2">
                  Documents demandés
                </h4>
                <ul className="space-y-1">
                  {request.requestedDocumentIds.map((docTypeId) => (
                    <li
                      key={docTypeId}
                      className="text-sm text-[var(--documo-text-secondary)] flex items-start gap-2"
                    >
                      <span className="text-[var(--documo-text-tertiary)] mt-1">
                        •
                      </span>
                      {getLabelById(docTypeId)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Link href={ROUTES.REQUESTS.DETAIL(request.id)}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Détails
                  </Button>
                </Link>

                <ShareLinkButton
                  requestId={request.id}
                  variant="outline"
                  size="sm"
                />

                {status === 'ACCEPTED' && (
                  <Link
                    href={`${ROUTES.REQUESTS.DETAIL(request.id)}?tab=documents`}
                  >
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      Documents
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
