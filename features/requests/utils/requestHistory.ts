import type { AppDocument, DocumentRequest } from '@/shared/types';

type HistoryEventKind =
  | 'REQUEST_CREATED'
  | 'REQUEST_ACCEPTED'
  | 'REQUEST_REJECTED'
  | 'REQUEST_COMPLETED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_VALIDATED'
  | 'DOCUMENT_REJECTED'
  | 'DOCUMENT_ERROR';

export interface RequestHistoryEvent {
  id: string;
  kind: HistoryEventKind;
  occurredAt: Date;
  title: string;
  description?: string;
}

export function buildRequestHistory(
  request: DocumentRequest & { documents?: AppDocument[] },
  getLabelById: (id: string) => string,
): RequestHistoryEvent[] {
  const events: RequestHistoryEvent[] = [
    {
      id: `request-created-${request.id}`,
      kind: 'REQUEST_CREATED',
      occurredAt: new Date(request.createdAt),
      title: 'Demande créée',
    },
  ];

  if (request.acceptedAt) {
    events.push({
      id: `request-accepted-${request.id}`,
      kind: 'REQUEST_ACCEPTED',
      occurredAt: new Date(request.acceptedAt),
      title: 'Demande acceptée',
    });
  }

  if (request.rejectedAt) {
    events.push({
      id: `request-rejected-${request.id}`,
      kind: 'REQUEST_REJECTED',
      occurredAt: new Date(request.rejectedAt),
      title: 'Demande refusée',
    });
  }

  if (request.completedAt) {
    events.push({
      id: `request-completed-${request.id}`,
      kind: 'REQUEST_COMPLETED',
      occurredAt: new Date(request.completedAt),
      title: 'Demande terminée',
    });
  }

  for (const document of request.documents || []) {
    const documentTypeLabel = getLabelById(document.typeId);
    events.push({
      id: `document-uploaded-${document.id}`,
      kind: 'DOCUMENT_UPLOADED',
      occurredAt: new Date(document.uploadedAt),
      title: `Document transmis: ${documentTypeLabel}`,
      description: document.fileName,
    });

    if (document.validatedAt) {
      events.push({
        id: `document-validated-${document.id}`,
        kind: 'DOCUMENT_VALIDATED',
        occurredAt: new Date(document.validatedAt),
        title: `Document validé: ${documentTypeLabel}`,
        description: document.fileName,
      });
    }

    if (document.invalidatedAt) {
      const invalidationReason = document.validationErrors?.[0];
      events.push({
        id: `document-rejected-${document.id}`,
        kind: 'DOCUMENT_REJECTED',
        occurredAt: new Date(document.invalidatedAt),
        title: `Document refusé: ${documentTypeLabel}`,
        description: invalidationReason || document.fileName,
      });
    }

    if (document.errorAt) {
      events.push({
        id: `document-error-${document.id}`,
        kind: 'DOCUMENT_ERROR',
        occurredAt: new Date(document.errorAt),
        title: `Erreur de traitement: ${documentTypeLabel}`,
        description: document.errorMessage || document.fileName,
      });
    }
  }

  return events.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
}
