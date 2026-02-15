import { DOCUMENT_STATUS_META } from '@/shared/constants';
import type { AppDocument } from '@/shared/types';
import { computeDocumentStatus } from '@/shared/utils/computedStatus';
import { Clock } from 'lucide-react';
import { DocumentListItem } from './DocumentListItem';

interface RequestDocumentsPanelProps {
  requestedDocumentIds: string[];
  documents: AppDocument[];
  getLabelById: (id: string) => string;
}

export function RequestDocumentsPanel({
  requestedDocumentIds,
  documents,
  getLabelById,
}: RequestDocumentsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            Documents requis
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {requestedDocumentIds.map((docTypeId) => {
              const uploadedDocs = documents.filter(
                (doc) => doc.typeId === docTypeId,
              );
              const latestDoc = uploadedDocs[0];
              const status = latestDoc
                ? computeDocumentStatus(latestDoc)
                : ('PENDING' as const);

              return (
                <div
                  key={docTypeId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      {getLabelById(docTypeId)}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${DOCUMENT_STATUS_META[status].badgeClass}`}
                  >
                    {!latestDoc && <Clock className="h-3 w-3" />}
                    {DOCUMENT_STATUS_META[status].label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            Documents transmis
          </h3>
        </div>
        {documents.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            Aucun document transmis pour le moment.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {documents.map((document) => (
              <DocumentListItem key={document.id} document={document} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
