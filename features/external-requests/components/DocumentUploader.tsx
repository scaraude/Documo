'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ROUTES } from '@/shared/constants';
import {
  formatAcceptedFormats,
  formatsToFileExtensions,
} from '@/shared/utils';
import {
  CheckCircle2,
  FileText,
  Info,
  Loader2,
  Upload,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { DocumentTypeId } from '../../document-types/client';
import { useDocumentTypes } from '../../document-types/hooks/useDocumentTypes';
import { uploadDocument } from '../api/uploadDocument';

interface DocumentUploaderProps {
  token: string;
  documentTypeIdsMissing: DocumentTypeId[];
  setDocumentTypeMissing: Dispatch<SetStateAction<string[]>>;
}

interface UploadStatus {
  [key: string]: {
    progress: number;
    status: 'idle' | 'uploading' | 'completed' | 'error';
    error?: string;
    file?: File;
  };
}

export const DocumentUploader = ({
  token,
  documentTypeIdsMissing,
  setDocumentTypeMissing,
}: DocumentUploaderProps) => {
  const router = useRouter();
  const { getLabelById, getDocumentTypeById } = useDocumentTypes();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({});
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Update uploadStatus when requiredDocuments changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: infinite loop otherwise
  useEffect(() => {
    const newUploadStatus: UploadStatus = {};
    for (const doc of documentTypeIdsMissing) {
      newUploadStatus[doc] = uploadStatus[doc] || {
        progress: 0,
        status: 'idle' as const,
      };
    }

    setUploadStatus(newUploadStatus);
  }, [documentTypeIdsMissing]); // Remove uploadStatus from dependencies to avoid infinite loop

  const handleFileUpload = async (
    file: File,
    documentTypeId: DocumentTypeId,
  ) => {
    try {
      setUploadStatus((prev) => ({
        ...prev,
        [documentTypeId]: { progress: 0, status: 'uploading', file },
      }));

      await uploadDocument({
        file,
        documentTypeId,
        token,
        onProgress: (progress) => {
          setUploadStatus((prev) => ({
            ...prev,
            [documentTypeId]: { ...prev[documentTypeId], progress },
          }));
        },
      });

      setDocumentTypeMissing((documentTypes) =>
        documentTypes.filter((dt) => dt !== documentTypeId),
      );
      setUploadStatus((prev) => ({
        ...prev,
        [documentTypeId]: { progress: 100, status: 'completed', file },
      }));

      // Check if all documents are uploaded - use current state
      setUploadStatus((currentStatus) => {
        const allCompleted = Object.values(currentStatus).every(
          (status) => status.status === 'completed',
        );

        if (allCompleted) {
          router.push(ROUTES.EXTERNAL.UPLOAD_SUCCESS(token));
        }

        return currentStatus;
      });
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        [documentTypeId]: {
          progress: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
          file,
        },
      }));
    }
  };

  const handleDragOver = (e: DragEvent, documentTypeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOver(documentTypeId);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOver(null);
  };

  const handleDrop = (e: DragEvent, documentTypeId: DocumentTypeId) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOver(null);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file, documentTypeId);
    }
  };

  const triggerFileInput = (documentTypeId: string) => {
    fileInputRefs.current[documentTypeId]?.click();
  };

  // Helper to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  // Don't render if requiredDocuments is empty or uploadStatus is not ready
  if (
    documentTypeIdsMissing.length === 0 ||
    Object.keys(uploadStatus).length === 0
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documentTypeIdsMissing.map((docTypeIdMissing) => {
        const status = uploadStatus[docTypeIdMissing];
        const documentType = getDocumentTypeById(docTypeIdMissing);
        const isDragging = draggedOver === docTypeIdMissing;

        // Safety check - skip if status doesn't exist
        if (!status) {
          return null;
        }

        return (
          <Card
            key={docTypeIdMissing}
            className={cn(
              'overflow-hidden transition-all duration-300 border-2 hover:shadow-xl flex flex-col',
              status.status === 'completed' &&
              'border-green-300 bg-green-50/30',
              status.status === 'error' && 'border-red-300 bg-red-50/30',
              status.status === 'uploading' && 'border-blue-300 bg-blue-50/30',
              status.status === 'idle' &&
              'border-gray-200 hover:border-blue-300',
              isDragging && 'border-blue-500 bg-blue-50 shadow-2xl scale-105',
            )}
          >
            {/* Header Section */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 bg-white">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {getLabelById(docTypeIdMissing)}
              </h3>
              {documentType?.description && (
                <p className="text-xs text-gray-600 line-clamp-2">
                  {documentType.description}
                </p>
              )}
            </div>

            {/* Upload Zone or File Info */}
            <div className="px-6 py-6 flex-1 flex flex-col">
              {status.status === 'idle' && (
                <>
                  <div
                    onDragOver={(e) => handleDragOver(e, docTypeIdMissing)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, docTypeIdMissing)}
                    className={cn(
                      'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group flex-1 min-h-[200px] flex items-center justify-center',
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/30',
                    )}
                  >
                    <input
                      ref={(el) => {
                        fileInputRefs.current[docTypeIdMissing] = el;
                      }}
                      type="file"
                      className="hidden"
                      accept={
                        documentType
                          ? formatsToFileExtensions(documentType.acceptedFormats)
                          : '.pdf,.jpg,.jpeg,.png'
                      }
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, docTypeIdMissing);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => triggerFileInput(docTypeIdMissing)}
                      className="w-full h-full flex items-center justify-center p-6"
                    >
                      <div className="text-center">
                        <div
                          className={cn(
                            'inline-flex p-4 rounded-2xl transition-all duration-300 mb-4',
                            isDragging
                              ? 'bg-blue-100 scale-110'
                              : 'bg-gray-100 group-hover:bg-blue-100 group-hover:scale-105',
                          )}
                        >
                          <Upload
                            className={cn(
                              'w-8 h-8 transition-colors duration-300',
                              isDragging
                                ? 'text-blue-600'
                                : 'text-gray-600 group-hover:text-blue-600',
                            )}
                          />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Fais glisser ici
                        </p>
                        <p className="text-xs text-gray-500">
                          ou clique pour parcourir
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* File Requirements */}
                  {documentType && (
                    <div className="mt-4 text-xs text-gray-600 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <span className="font-semibold text-gray-700">Format accepté:</span>
                        <span className="flex-1">{formatAcceptedFormats(documentType.acceptedFormats)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-700">Taille max:</span>
                        <span>{documentType.maxSizeMB} Mo</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {status.file && status.status !== 'idle' && (
                <div className="flex-1 flex flex-col">
                  <div
                    className={cn(
                      'rounded-2xl p-6 transition-all duration-300 flex-1 flex flex-col justify-center',
                      status.status === 'completed' && 'bg-green-50 border-2 border-green-200',
                      status.status === 'uploading' && 'bg-blue-50 border-2 border-blue-200',
                      status.status === 'error' && 'bg-red-50 border-2 border-red-200',
                    )}
                  >
                    {/* Status Icon */}
                    <div className="flex justify-center mb-4">
                      {status.status === 'completed' && (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                          <CheckCircle2 className="w-8 h-8 text-green-600 animate-in zoom-in duration-300" />
                        </div>
                      )}
                      {status.status === 'uploading' && (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                      )}
                      {status.status === 'error' && (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                          <XCircle className="w-8 h-8 text-red-600 animate-in zoom-in duration-300" />
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                        {status.file.name}
                      </p>
                      <p className="text-xs text-gray-600 mb-4">
                        {formatFileSize(status.file.size)}
                      </p>

                      {/* Progress Bar */}
                      {status.status === 'uploading' && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-blue-700">
                              Envoi...
                            </span>
                            <span className="text-xs font-bold text-blue-700">
                              {status.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${status.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Success Message */}
                      {status.status === 'completed' && (
                        <div className="text-xs font-semibold text-green-700">
                          Téléversé avec succès
                        </div>
                      )}

                      {/* Error Message */}
                      {status.status === 'error' && (
                        <>
                          <div className="text-xs font-medium text-red-700 mb-3">
                            {status.error}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => triggerFileInput(docTypeIdMissing)}
                            className="w-full"
                          >
                            Réessayer
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
