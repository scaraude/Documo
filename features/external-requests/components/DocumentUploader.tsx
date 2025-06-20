'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ROUTES } from '@/shared/constants';
import { uploadDocument } from '../api/uploadDocument';
import { useDocumentTypes } from '../../document-types/hooks/useDocumentTypes';
import { DocumentTypeId } from '../../document-types/client';

interface DocumentUploaderProps {
  token: string;
  documentTypesMissing: DocumentTypeId[];
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
  documentTypesMissing: documentTypeMissing,
  setDocumentTypeMissing,
}: DocumentUploaderProps) => {
  const router = useRouter();
  const { getLabel } = useDocumentTypes();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({});

  // Update uploadStatus when requiredDocuments changes
  useEffect(() => {
    const newUploadStatus = documentTypeMissing.reduce(
      (acc, doc) => ({
        ...acc,
        [doc]: uploadStatus[doc] || { progress: 0, status: 'idle' as const },
      }),
      {}
    );

    setUploadStatus(newUploadStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentTypeMissing]); // Remove uploadStatus from dependencies to avoid infinite loop

  const handleFileUpload = async (
    file: File,
    documentTypeId: DocumentTypeId
  ) => {
    try {
      setUploadStatus(prev => ({
        ...prev,
        [documentTypeId]: { progress: 0, status: 'uploading', file },
      }));

      await uploadDocument({
        file,
        documentTypeId,
        token,
        onProgress: progress => {
          setUploadStatus(prev => ({
            ...prev,
            [documentTypeId]: { ...prev[documentTypeId], progress },
          }));
        },
      });

      setDocumentTypeMissing(documentTypes =>
        documentTypes.filter(dt => dt !== documentTypeId)
      );
      setUploadStatus(prev => ({
        ...prev,
        [documentTypeId]: { progress: 100, status: 'completed', file },
      }));

      // Check if all documents are uploaded - use current state
      setUploadStatus(currentStatus => {
        const allCompleted = Object.values(currentStatus).every(
          status => status.status === 'completed'
        );

        if (allCompleted) {
          router.push(ROUTES.EXTERNAL.UPLOAD_SUCCESS(token));
        }

        return currentStatus;
      });
    } catch (error) {
      setUploadStatus(prev => ({
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

  // Don't render if requiredDocuments is empty or uploadStatus is not ready
  if (
    documentTypeMissing.length === 0 ||
    Object.keys(uploadStatus).length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-6">
      {documentTypeMissing.map(documentType => {
        const status = uploadStatus[documentType];

        // Safety check - skip if status doesn't exist
        if (!status) {
          return null;
        }

        return (
          <Card key={documentType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  {getLabel(documentType)}
                </h3>
                <p className="text-sm text-gray-500">
                  {status.status === 'idle' && 'En attente du document'}
                  {status.status === 'uploading' &&
                    `Upload en cours ${status.progress}%`}
                  {status.status === 'completed' && 'Document téléversé'}
                  {status.status === 'error' && status.error}
                </p>
              </div>
              <div>
                {status.status !== 'completed' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.jpg,.jpeg,.png';
                      input.onchange = e => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          handleFileUpload(file, documentType);
                        }
                      };
                      input.click();
                    }}
                    disabled={status.status === 'uploading'}
                  >
                    {status.status === 'uploading'
                      ? 'En cours...'
                      : 'Choisir un fichier'}
                  </Button>
                )}
              </div>
            </div>
            {status.status === 'uploading' && (
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${status.progress}%` }}
                ></div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
