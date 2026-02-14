'use client';

import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { APP_ICON_PATH } from '@/shared/constants';
import { Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { DocumentUploader } from '../../../../features/external-requests/components/DocumentUploader';
import { useExternalRequest } from '../../../../features/external-requests/hooks/useExternalRequest';

export default function ExternalUploadPage() {
  const { token }: { token: string } = useParams();
  const { getRequestByToken, getDocumentsByToken } = useExternalRequest();
  const { getLabelById } = useDocumentTypes();
  const [documentTypesMissing, setDocumentTypesMissing] = useState<string[]>(
    [],
  );
  const { data: request, isLoading, error } = getRequestByToken(token);
  const { data: documents } = getDocumentsByToken(token);

  useEffect(() => {
    if (request) {
      const docTypeIdsMissing = documents
        ? request.requestedDocumentIds.filter(
          (doc) => !documents.some((d) => d.typeId === doc),
        )
        : request.requestedDocumentIds;
      setDocumentTypesMissing(docTypeIdsMissing);
    }
  }, [request, documents]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F5F7' }}>
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl"
            style={{ backgroundColor: '#E8F1FC' }}
          >
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2B7AE8' }} />
          </div>
          <p className="text-base font-medium" style={{ color: '#1A1A2E' }}>
            Chargement de ta demande...
          </p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F4F5F7' }}>
        <div
          className="max-w-md w-full bg-white rounded-lg p-10 text-center"
          style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl"
            style={{ backgroundColor: '#FEE2E2' }}
          >
            <svg className="w-8 h-8" style={{ color: '#DC2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-3" style={{ color: '#1A1A2E' }}>
            Demande introuvable
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#4A4A5A' }}>
            Ce lien n'est plus valide ou a expiré. Contacte la personne qui t'a envoyé cette demande.
          </p>
        </div>
      </div>
    );
  }

  // Count uploaded documents
  const totalDocuments = request.requestedDocumentIds.length;
  const uploadedCount = totalDocuments - documentTypesMissing.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src={APP_ICON_PATH}
              alt="Documo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-lg font-semibold text-[var(--documo-blue)]">
              Documo
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1A1A2E' }}>
            Demande de documents
          </h1>
          <p className="text-base" style={{ color: '#4A4A5A' }}>
            <span className="font-medium" style={{ color: '#1A1A2E' }}>{request.requesterName}</span>
            {' '}a envoyé une demande pour les documents suivants:{' '}
          </p>
        </div>

        {/* Progress indicator */}
        <div
          className="bg-white rounded-lg p-6 mb-8"
          style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
        >
          {/* Document checklist */}
          <div className="space-y-3">
            {request.requestedDocumentIds.map((docTypeId) => {
              const isUploaded = !documentTypesMissing.includes(docTypeId);
              return (
                <div
                  key={docTypeId}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isUploaded ? '#16A34A' : '#E5E7EB',
                    }}
                  >
                    {isUploaded && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color: isUploaded ? '#8E8E9E' : '#1A1A2E',
                      textDecoration: isUploaded ? 'line-through' : 'none'
                    }}
                  >
                    {getLabelById(docTypeId)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between my-4">
            <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>
              Progression
            </span>
            <span className="text-sm" style={{ color: '#4A4A5A' }}>
              {uploadedCount} sur {totalDocuments} document{totalDocuments > 1 ? 's' : ''}
            </span>
          </div>
          {/* Progress bar */}
          <div
            className="h-2 rounded-full overflow-hidden mb-6"
            style={{ backgroundColor: '#E8F1FC' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                backgroundColor: uploadedCount === totalDocuments ? '#16A34A' : '#2B7AE8',
                width: `${(uploadedCount / totalDocuments) * 100}%`
              }}
            />
          </div>


        </div>

        {/* Upload section */}
        {documentTypesMissing.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-6" style={{ color: '#1A1A2E' }}>
              Documents à envoyer
            </h2>
            <DocumentUploader
              token={token}
              documentTypeIdsMissing={documentTypesMissing}
              setDocumentTypeMissing={setDocumentTypesMissing}
            />
          </div>
        ) : (
          <div
            className="bg-white rounded-lg p-10 text-center"
            style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full"
              style={{ backgroundColor: '#DCFCE7' }}
            >
              <Check className="w-8 h-8" style={{ color: '#16A34A' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#1A1A2E' }}>
              C'est envoyé.
            </h3>
            <p className="text-sm" style={{ color: '#4A4A5A' }}>
              Tous les documents ont été transmis. Tu recevras une confirmation par email.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs" style={{ color: '#8E8E9E' }}>
            Tes documents sont transmis de manière sécurisée via Documo.
          </p>
        </div>
      </footer>
    </div>
  );
}
