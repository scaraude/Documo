'use client';

import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { useDocument } from '@/features/documents/hooks/useDocument';
import { Card } from '@/shared/components/ui/card';
import { APP_ICON_PATH } from '@/shared/constants';
import {
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  Loader2,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { DocumentUploader } from '../../../../features/external-requests/components/DocumentUploader';
import { useExternalRequest } from '../../../../features/external-requests/hooks/useExternalRequest';

export default function ExternalUploadPage() {
  const { token }: { token: string } = useParams();
  const { getRequestByToken } = useExternalRequest();
  const { getDocumentsByRequestId } = useDocument();
  const { getLabelById } = useDocumentTypes();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documentTypesMissing, setDocumentTypesMissing] = useState<string[]>(
    [],
  );
  const { data: request, isLoading, error } = getRequestByToken(token);
  const { data: documents } = getDocumentsByRequestId(request?.id);

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

  useEffect(() => {
    // Check if user is authenticated via FranceConnect or email
    // This will be implemented in ticket 5
    const checkAuth = async () => {
      // Temporary mock
      setIsAuthenticated(true);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-white rounded-3xl shadow-xl">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <p className="text-base font-medium text-gray-700">
            Chargement de votre demande...
          </p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-2 border-red-200 bg-red-50/50 shadow-xl">
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-red-100 rounded-3xl">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Demande non trouvée
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Aucune demande trouvée pour ce lien. Veuillez vérifier le lien ou
              contacter le support.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-2 border-red-200 bg-red-50/50 shadow-xl">
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-red-100 rounded-3xl">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Erreur</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cette demande n&apos;existe pas ou a expiré.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-2 border-amber-200 bg-amber-50/50 shadow-xl">
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-amber-100 rounded-3xl">
              <ShieldAlert className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Authentification requise
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Veuillez vous authentifier pour accéder à cette page.
            </p>
            {/* Authentication components will be added in ticket 5 */}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Hero Header Section */}
        <div className="flex w-full justify-center mb-12">
          <div className="flex">
            <div className="flex w-1/2 justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full" />
                <Image
                  src={APP_ICON_PATH}
                  alt="Documo"
                  width={100}
                  height={100}
                  className="relative rounded-2xl shadow-xl"
                />
              </div>
            </div>

            <div className='flex-col w-full h-full'>

              <div className="flex-col w-full ml-12 mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Bienvenue sur Documo
                </h1>

                <div className="max-w-2xl mx-auto">
                  <p className="text-lg text-gray-700 mb-2">
                    <span className="font-semibold">{request.requesterName}</span> a besoin de différents
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    documents pour le dossier <span className="font-semibold text-blue-600">{request.folderName}</span>
                  </p>
                </div>
              </div>

              {/* Progress Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {request.requestedDocumentIds.map((docTypeId, index) => {
                  const isUploaded = !documentTypesMissing.includes(docTypeId);
                  return (
                    <div
                      key={`pill-${docTypeId.toLowerCase()}-${index}`}
                      className={`
                  inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                  transition-all duration-300 border-2
                  ${isUploaded
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                        }
                  `}
                    >
                      <span>{getLabelById(docTypeId)}</span>
                      {isUploaded ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* Documents Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Documents nécessaires
          </h2>

          {documentTypesMissing.length > 0 ? (
            <DocumentUploader
              token={token}
              documentTypeIdsMissing={documentTypesMissing}
              setDocumentTypeMissing={setDocumentTypesMissing}
            />
          ) : (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-xl">
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-3xl">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Tous les documents ont été téléversés
                  </h3>
                  <p className="text-base text-gray-700">
                    Votre demande est complète. Vous serez notifié par email.
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
