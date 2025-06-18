'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/shared/components/ui/card';
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '@/shared/mapper';
import { Badge } from '@/shared/components/ui/badge';
import { FileText } from 'lucide-react';
import { useExternalRequest } from '../../../../features/external-requests/hooks/useExternalRequest';

export default function ExternalRequestPage() {
  const { token }: { token: string } = useParams();
  const { getRequestByToken } = useExternalRequest();
  const { data: request, isLoading, error } = getRequestByToken(token);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Chargement...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800">Erreur</h1>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Demande non trouvée
          </h1>
          <p className="text-gray-600 mt-2">
            La demande n&apos;existe pas ou a expiré.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl w-full mx-auto p-6">
        <Card className="border-t-4 border-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-blue-100 p-2 mr-3">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Demande de documents
              </h2>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">
                Documents demandés
              </div>
              <div className="space-y-2">
                {request.requestedDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700 font-medium">
                        {APP_DOCUMENT_TYPE_TO_LABEL_MAP[doc]}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Requis
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Vos documents seront stockés de manière sécurisée et pourront être
              réutilisés pour de futures demandes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
