import type { AppDocument } from '@/shared/types';
import { DocumentListItem } from './DocumentListItem';

interface RequestDocumentsPanelProps {
  requestedDocumentIds: string[];
  documents: AppDocument[];
  getLabelById: (id: string) => string;
}

export function RequestDocumentsPanel({
  documents,
}: RequestDocumentsPanelProps) {
  return (
    <div className="space-y-6">
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
