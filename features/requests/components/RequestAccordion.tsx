'use client';
import { useState } from 'react';
import {
  DocumentRequest,
  ComputedRequestStatus,
  DocumentRequestWithFolder,
} from '@/shared/types';
import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { Badge, Button } from '@/shared/components';
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  Hash,
  FileText,
  Clock,
  User,
  FolderOpen,
  Eye,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { ROUTES } from '../../../shared/constants';
import { ShareLinkButton } from '@/features/external-requests/components/ShareLinkButton';

interface RequestAccordionProps {
  request: DocumentRequestWithFolder;
  getRequestStatus: (request: DocumentRequest) => ComputedRequestStatus;
}

export const RequestAccordion = ({
  request,
  getRequestStatus,
}: RequestAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getLabel } = useDocumentTypes();
  const status = getRequestStatus(request);

  const getStatusColor = (status: ComputedRequestStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'ACCEPTED':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'REJECTED':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
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

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-transparent rounded-3xl">
      {/* Collapsed Header */}
      <div
        className="px-6 py-5 cursor-pointer select-none group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 min-w-0 flex-1">
            {/* Expand Icon */}
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-blue-500 transition-colors" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              )}
            </div>

            {/* Email and Folder */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hash className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {request.email}
                </span>
                {request.folder && (
                  <span className="text-xs text-gray-500 font-medium flex items-center">
                    <FolderOpen className="h-3 w-3 mr-1" />
                    {request.folder.name}
                  </span>
                )}
              </div>
            </div>

            {/* Documents Count */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {request.requestedDocuments.length} document
                {request.requestedDocuments.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {formatRelativeTime(request.createdAt)}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            className={`text-sm font-semibold border-1 ${getStatusColor(status)} shadow-sm`}
          >
            {getStatusLabel(status)}
          </Badge>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-6 py-6 bg-gray-50 rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Request Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Informations de la demande
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{request.email}</span>
                  </div>
                  {request.folder && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Dossier:</span>
                      <span className="font-medium flex items-center">
                        <FolderOpen className="h-3 w-3 mr-1" />
                        {request.folder.name}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Créée le:</span>
                    <span>{formatDateTime(request.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expire le:</span>
                    <span>{formatDateTime(request.expiresAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Statut:</span>
                    <Badge
                      className={`px-2 py-0.5 text-xs ${getStatusColor(status)}`}
                    >
                      {getStatusLabel(status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Chronologie
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Demande créée</span>
                    <span className="text-gray-400 ml-auto">
                      {formatRelativeTime(request.createdAt)}
                    </span>
                  </div>
                  {request.acceptedAt && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                      <span className="text-gray-600">Demande acceptée</span>
                      <span className="text-gray-400 ml-auto">
                        {formatRelativeTime(request.acceptedAt)}
                      </span>
                    </div>
                  )}
                  {request.rejectedAt && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                      <span className="text-gray-600">Demande refusée</span>
                      <span className="text-gray-400 ml-auto">
                        {formatRelativeTime(request.rejectedAt)}
                      </span>
                    </div>
                  )}
                  {request.completedAt && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-gray-600">Demande terminée</span>
                      <span className="text-gray-400 ml-auto">
                        {formatRelativeTime(request.completedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Documents */}
              <div>
                <div className="text-xs text-gray-500 mb-2">
                  {request.requestedDocuments.length} documents
                </div>
                <div className="space-y-1">
                  {request.requestedDocuments.map((docType, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      • {getLabel(docType)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ">
                <Link href={ROUTES.REQUESTS.DETAIL(request.id)}>
                  <Button className="w-full" variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    Voir les détails
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
                    <Button className="w-full" variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                      Voir les documents
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
