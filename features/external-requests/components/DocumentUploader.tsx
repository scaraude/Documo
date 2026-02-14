'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/constants';
import {
  formatAcceptedFormats,
  formatsToFileExtensions,
} from '@/shared/utils';
import {
  Check,
  Loader2,
  Upload,
  X,
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
  }, [documentTypeIdsMissing]);

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

      // Check if all documents are uploaded
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
          error: error instanceof Error ? error.message : 'Échec de l\'envoi',
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'Ko', 'Mo'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  if (
    documentTypeIdsMissing.length === 0 ||
    Object.keys(uploadStatus).length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-4">
      {documentTypeIdsMissing.map((docTypeIdMissing) => {
        const status = uploadStatus[docTypeIdMissing];
        const documentType = getDocumentTypeById(docTypeIdMissing);
        const isDragging = draggedOver === docTypeIdMissing;

        if (!status) {
          return null;
        }

        return (
          <div
            key={docTypeIdMissing}
            className="bg-white rounded-lg overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: '#E5E7EB' }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ color: '#1A1A2E' }}
              >
                {getLabelById(docTypeIdMissing)}
              </h3>
              {documentType?.description && (
                <p
                  className="text-xs mt-1"
                  style={{ color: '#8E8E9E' }}
                >
                  {documentType.description}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Idle state - upload zone */}
              {status.status === 'idle' && (
                <>
                  <div
                    onDragOver={(e) => handleDragOver(e, docTypeIdMissing)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, docTypeIdMissing)}
                    className={cn(
                      'relative rounded-lg border-2 border-dashed transition-colors cursor-pointer',
                      isDragging ? 'border-[#2B7AE8] bg-[#E8F1FC]' : 'border-[#E5E7EB] hover:border-[#2B7AE8]',
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
                      className="w-full p-8 flex flex-col items-center"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                        style={{ backgroundColor: '#E8F1FC' }}
                      >
                        <Upload className="w-5 h-5" style={{ color: '#2B7AE8' }} />
                      </div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: '#1A1A2E' }}
                      >
                        Glisse ton fichier ici
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: '#8E8E9E' }}
                      >
                        ou clique pour parcourir
                      </p>
                    </button>
                  </div>

                  {/* File requirements */}
                  {documentType && (
                    <div
                      className="mt-4 flex items-center gap-4 text-xs"
                      style={{ color: '#8E8E9E' }}
                    >
                      <span>
                        <span style={{ color: '#4A4A5A' }}>Formats :</span>{' '}
                        {formatAcceptedFormats(documentType.acceptedFormats)}
                      </span>
                      <span>
                        <span style={{ color: '#4A4A5A' }}>Taille max :</span>{' '}
                        {documentType.maxSizeMB} Mo
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Uploading state */}
              {status.status === 'uploading' && status.file && (
                <div className="py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#E8F1FC' }}
                    >
                      <Loader2
                        className="w-5 h-5 animate-spin"
                        style={{ color: '#2B7AE8' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: '#1A1A2E' }}
                      >
                        {status.file.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: '#8E8E9E' }}
                      >
                        {formatFileSize(status.file.size)}
                      </p>
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: '#2B7AE8' }}
                    >
                      {status.progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: '#E8F1FC' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: '#2B7AE8',
                        width: `${status.progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Completed state */}
              {status.status === 'completed' && status.file && (
                <div className="py-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#DCFCE7' }}
                    >
                      <Check className="w-5 h-5" style={{ color: '#16A34A' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: '#1A1A2E' }}
                      >
                        {status.file.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: '#16A34A' }}
                      >
                        Envoyé
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error state */}
              {status.status === 'error' && status.file && (
                <div className="py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FEE2E2' }}
                    >
                      <X className="w-5 h-5" style={{ color: '#DC2626' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: '#1A1A2E' }}
                      >
                        {status.file.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: '#DC2626' }}
                      >
                        {status.error}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerFileInput(docTypeIdMissing)}
                    className="w-full"
                    style={{
                      borderColor: '#E5E7EB',
                      color: '#1A1A2E',
                    }}
                  >
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
