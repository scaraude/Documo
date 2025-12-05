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
    <div className="space-y-5">
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
              'overflow-hidden transition-all duration-300 border-2',
              status.status === 'completed' &&
              'border-green-200 bg-green-50/30',
              status.status === 'error' && 'border-red-200 bg-red-50/30',
              status.status === 'uploading' && 'border-blue-200 bg-blue-50/30',
              status.status === 'idle' &&
              'border-gray-200 hover:border-gray-300',
              isDragging && 'border-blue-400 bg-blue-50',
            )}
          >
            {/* Header Section */}
            <div className="px-8 pt-8 pb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={cn(
                        'p-2.5 rounded-xl transition-colors duration-300',
                        status.status === 'completed' && 'bg-green-100',
                        status.status === 'error' && 'bg-red-100',
                        status.status === 'uploading' && 'bg-blue-100',
                        status.status === 'idle' && 'bg-gray-100',
                      )}
                    >
                      <FileText
                        className={cn(
                          'w-5 h-5 transition-colors duration-300',
                          status.status === 'completed' && 'text-green-600',
                          status.status === 'error' && 'text-red-600',
                          status.status === 'uploading' && 'text-blue-600',
                          status.status === 'idle' && 'text-gray-600',
                        )}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getLabelById(docTypeIdMissing)}
                    </h3>
                  </div>
                  {documentType?.description && (
                    <p className="text-sm text-gray-600 ml-[52px]">
                      {documentType.description}
                    </p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="ml-4">
                  {status.status === 'completed' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-6 h-6 animate-in zoom-in duration-300" />
                    </div>
                  )}
                  {status.status === 'uploading' && (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  )}
                  {status.status === 'error' && (
                    <XCircle className="w-6 h-6 text-red-600 animate-in zoom-in duration-300" />
                  )}
                </div>
              </div>
            </div>

            {/* Upload Zone or File Info */}
            <div className="px-8 pb-8">
              {status.status === 'idle' && (
                <div
                  onDragOver={(e) => handleDragOver(e, docTypeIdMissing)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, docTypeIdMissing)}
                  className={cn(
                    'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group',
                    isDragging
                      ? 'border-blue-400 bg-blue-50/50'
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-50',
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
                    className="w-full px-8 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className={cn(
                          'p-4 rounded-2xl transition-all duration-300',
                          isDragging
                            ? 'bg-blue-100 scale-110'
                            : 'bg-gray-100 group-hover:bg-gray-200 group-hover:scale-105',
                        )}
                      >
                        <Upload
                          className={cn(
                            'w-8 h-8 transition-colors duration-300',
                            isDragging
                              ? 'text-blue-600'
                              : 'text-gray-600 group-hover:text-gray-700',
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900 mb-1">
                          {isDragging
                            ? 'Déposez votre fichier ici'
                            : 'Glissez-déposez votre fichier'}
                        </p>
                        <p className="text-sm text-gray-500">
                          ou{' '}
                          <span className="text-blue-600 font-medium">
                            parcourez vos fichiers
                          </span>
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {status.file && status.status !== 'idle' && (
                <div
                  className={cn(
                    'rounded-2xl p-6 transition-all duration-300',
                    status.status === 'completed' && 'bg-green-50',
                    status.status === 'uploading' && 'bg-blue-50',
                    status.status === 'error' && 'bg-red-50',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={cn(
                          'p-3 rounded-xl shrink-0',
                          status.status === 'completed' && 'bg-green-100',
                          status.status === 'uploading' && 'bg-blue-100',
                          status.status === 'error' && 'bg-red-100',
                        )}
                      >
                        <FileText
                          className={cn(
                            'w-5 h-5',
                            status.status === 'completed' && 'text-green-700',
                            status.status === 'uploading' && 'text-blue-700',
                            status.status === 'error' && 'text-red-700',
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {status.file.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatFileSize(status.file.size)}
                        </p>
                      </div>
                    </div>

                    {status.status === 'error' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerFileInput(docTypeIdMissing)}
                        className="shrink-0 ml-4"
                      >
                        Réessayer
                      </Button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {status.status === 'uploading' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-700">
                          Téléversement en cours...
                        </span>
                        <span className="text-xs font-semibold text-blue-700">
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
                    <div className="mt-3 flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        Document téléversé avec succès
                      </span>
                    </div>
                  )}

                  {/* Error Message */}
                  {status.status === 'error' && status.error && (
                    <div className="mt-3 flex items-start gap-2 text-red-700">
                      <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-xs font-medium">
                        {status.error}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* File Requirements */}
              {documentType && status.status === 'idle' && (
                <div className="mt-4 flex items-start gap-2 px-4 py-3 bg-gray-50 rounded-xl">
                  <Info className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-medium">Formats acceptés:</span>{' '}
                    {formatAcceptedFormats(documentType.acceptedFormats)}
                    <span className="mx-2">•</span>
                    <span className="font-medium">Taille maximale:</span>{' '}
                    {documentType.maxSizeMB} Mo
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
