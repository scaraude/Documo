'use client';

import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { RequestDocumentsPanel } from '@/features/documents/components/RequestDocumentsPanel';
import { ShareLinkButton } from '@/features/external-requests/components/ShareLinkButton';
import { useRequests } from '@/features/requests';
import {
  type RequestHistoryEvent,
  buildRequestHistory,
} from '@/features/requests/utils/requestHistory';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { REQUEST_STATUS_META } from '@/shared/constants';
import type { ComputedRequestStatus, DocumentRequest } from '@/shared/types';
import { computeRequestStatus } from '@/shared/utils/computedStatus';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileCheck,
  FileText,
  History,
  XCircle,
} from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

function RequestDetailContent() {
  const params: { id: string } = useParams();
  const searchParams = useSearchParams();
  const { getById } = useRequests();
  const { data: request, isLoading, error } = getById(params.id);
  const { getLabelById } = useDocumentTypes();
  const [activeTab, setActiveTab] = useState('overview');

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'documents', 'history'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const getRequestStatus = (request: DocumentRequest): ComputedRequestStatus =>
    computeRequestStatus(request);

  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  const formatDateTime = (date: Date) => {
    return format(new Date(date), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  };

  const historyEvents = useMemo(() => {
    if (!request) {
      return [];
    }
    return buildRequestHistory(request, getLabelById);
  }, [request, getLabelById]);

  const getHistoryIcon = (event: RequestHistoryEvent) => {
    switch (event.kind) {
      case 'REQUEST_ACCEPTED':
      case 'REQUEST_COMPLETED':
      case 'DOCUMENT_VALIDATED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REQUEST_REJECTED':
      case 'DOCUMENT_REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'DOCUMENT_ERROR':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'DOCUMENT_UPLOADED':
        return <FileCheck className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Erreur: La demande n&apos;a pas été trouvée</p>
      </div>
    );
  }

  const status = getRequestStatus(request);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Demande #{request.id.substring(0, 8)}
                </h1>
                <Badge
                  className={`px-3 py-1 text-sm font-medium border ${REQUEST_STATUS_META[status].badgeClass}`}
                >
                  {REQUEST_STATUS_META[status].label}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Créée {formatRelativeTime(request.createdAt)}
              </p>
            </div>
            <div>
              <ShareLinkButton requestId={request.id} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Détails de la demande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-gray-600">Email</div>
                    <div className="font-medium">{request.email}</div>
                    <div className="text-gray-600">Statut</div>
                    <div>
                      <Badge
                        className={`px-2 py-0.5 text-xs font-medium border ${REQUEST_STATUS_META[status].badgeClass}`}
                      >
                        {REQUEST_STATUS_META[status].label}
                      </Badge>
                    </div>
                    <div className="text-gray-600">Créée le</div>
                    <div className="font-medium">
                      {formatDateTime(request.createdAt)}
                    </div>
                    <div className="text-gray-600">Expire le</div>
                    <div className="font-medium">
                      {formatDateTime(request.expiresAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <History className="h-4 w-4 mr-2" />
                    Chronologie
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    {historyEvents.slice(0, 5).map((event) => (
                      <div
                        key={`overview-${event.id}`}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0">
                          {getHistoryIcon(event)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(event.occurredAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <RequestDocumentsPanel
              requestedDocumentIds={request.requestedDocumentIds}
              documents={request.documents || []}
              getLabelById={getLabelById}
            />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Historique des modifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historyEvents.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    Aucun historique disponible
                  </p>
                ) : (
                  <div className="space-y-4">
                    {historyEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                      >
                        <div className="mt-0.5">{getHistoryIcon(event)}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {event.title}
                          </p>
                          {event.description && (
                            <p className="text-xs text-gray-600 mt-0.5">
                              {event.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDateTime(event.occurredAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function RequestDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      }
    >
      <RequestDetailContent />
    </Suspense>
  );
}
