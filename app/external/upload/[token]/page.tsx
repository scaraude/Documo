'use client';

import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { useDocument } from '@/features/documents/hooks/useDocument';
import { Card } from '@/shared/components/ui/card';
import { APP_ICON_PATH } from '@/shared/constants';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck,
  Loader2,
  Lock,
  Shield,
  ShieldAlert,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-white rounded-2xl shadow-lg">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            Chargement de votre demande...
          </p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-2 border-red-200 bg-red-50/30">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-red-100 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-red-600" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-2 border-red-200 bg-red-50/30">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-red-100 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-red-600" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-2 border-amber-200 bg-amber-50/30">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-amber-100 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-amber-600" />
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

  const totalDocuments = request.requestedDocumentIds.length;
  const uploadedDocuments = totalDocuments - documentTypesMissing.length;
  const progress =
    totalDocuments > 0 ? (uploadedDocuments / totalDocuments) * 100 : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Compact Header */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src={APP_ICON_PATH}
                alt="Documo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Documo</h1>
                <p className="text-xs text-gray-500">
                  L&apos;échange de documents à l&apos;ère moderne
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700 font-medium">Sécurisé</span>
            </div>
          </div>

          {/* Request Context */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  Demande de documents pour : {request.folderName}
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">{request.requesterName}</span> (
                  {request.requesterEmail}) vous demande de fournir les
                  documents suivants.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {uploadedDocuments}/{totalDocuments} documents
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Chiffré E2EE
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    RGPD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {totalDocuments > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">
                  Progression
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Document List */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Documents demandés
          </h3>
          <div className="space-y-2">
            {request.requestedDocumentIds.map((docTypeId, index) => {
              const isUploaded = !documentTypesMissing.includes(docTypeId);
              return (
                <div
                  key={`${docTypeId.toLowerCase()}-${index}`}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                >
                  {isUploaded ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                  <span
                    className={`text-sm flex-1 ${isUploaded ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                  >
                    {getLabelById(docTypeId)}
                  </span>
                  {isUploaded && (
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload Section */}
        {documentTypesMissing.length > 0 ? (
          <DocumentUploader
            token={token}
            documentTypeIdsMissing={documentTypesMissing}
            setDocumentTypeMissing={setDocumentTypesMissing}
          />
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tous les documents ont été téléversés
            </h3>
            <p className="text-sm text-gray-600">
              Votre demande est complète. Vous serez notifié par email.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>
            🔒 Vos documents sont protégés par chiffrement E2EE • Conforme RGPD
          </p>
        </div>
      </div>
    </div>
  );
}
