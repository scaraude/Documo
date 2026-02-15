import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { DOCUMENT_STATUS_META } from '@/shared/constants';
import type { AppDocument } from '@/shared/types';
import { computeDocumentStatus } from '@/shared/utils/computedStatus';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { DocumentViewer } from './DocumentViewer';
import { DownloadButton } from './DownloadButton';

interface DocumentListItemProps {
  document: AppDocument;
}

export const DocumentListItem = ({ document }: DocumentListItemProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { getLabelById } = useDocumentTypes();
  const status = computeDocumentStatus(document);

  return (
    <>
      <li
        key={document.id}
        onClick={() => setIsViewerOpen(true)}
        className="px-4 py-4 flex items-center hover:bg-gray-50"
      >
        <div className="min-w-0 flex-1 flex items-center">
          <div className="flex-shrink-0">
            <svg
              aria-hidden="true"
              className="h-10 w-10 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1 px-4">
            <div>
              <p className="text-sm font-medium text-blue-600 truncate">
                {document.fileName}
              </p>
              <p className="mt-1 flex items-center text-sm text-gray-500">
                <span className="truncate">
                  {getLabelById(document.typeId)}
                </span>
                <span
                  className={`ml-1.5 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${DOCUMENT_STATUS_META[status].badgeClass}`}
                >
                  {DOCUMENT_STATUS_META[status].label}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsViewerOpen(true)}
            className="inline-flex items-center shadow-sm px-2.5 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </button>
          <DownloadButton document={document} />
        </div>
      </li>

      <DocumentViewer
        document={document}
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
      />
    </>
  );
};
