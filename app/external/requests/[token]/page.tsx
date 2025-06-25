'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { useExternalRequest } from '../../../../features/external-requests/hooks/useExternalRequest';
import { useState } from 'react';
import { toast } from 'sonner';
import { ROUTES } from '@/shared/constants/routes/paths';

export default function ExternalRequestPage() {
  const { token }: { token: string } = useParams();
  const router = useRouter();
  const { getRequestByToken, acceptRequest, declineRequest } =
    useExternalRequest();
  const { data: request, isLoading, error } = getRequestByToken(token);
  const { getLabel } = useDocumentTypes();

  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineMessage, setDeclineMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await acceptRequest.mutateAsync({ token });
      toast.success('Demande acceptée avec succès');
      router.push(ROUTES.EXTERNAL.UPLOAD(token));
    } catch {
      toast.error("Erreur lors de l'acceptation de la demande");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineClick = () => {
    setShowDeclineForm(true);
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    try {
      await declineRequest.mutateAsync({ token, message: declineMessage });
      toast.success('Demande refusée');
      // Stay on the same page to show the declined state
    } catch {
      toast.error('Erreur lors du refus de la demande');
    } finally {
      setIsProcessing(false);
    }
  };

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

  // Check if request has already been accepted or declined
  const isAccepted = request.acceptedAt;
  const isDeclined = request.rejectedAt;

  if (isAccepted) {
    // If already accepted, redirect to upload page
    router.push(ROUTES.EXTERNAL.UPLOAD(token));
    return null;
  }

  if (isDeclined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-2xl w-full mx-auto p-6">
          <Card className="border-t-4 border-red-500">
            <CardContent className="pt-6">
              <div className="flex items-center mb-6">
                <div className="rounded-full bg-red-100 p-2 mr-3">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Demande refusée
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Cette demande de documents a été refusée.
              </p>
              {request.declineMessage && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Motif :</strong> {request.declineMessage}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
                        {getLabel(doc)}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Requis
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {!showDeclineForm && (
              <div className="flex gap-4 mb-6">
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Traitement...' : 'Accepter'}
                </Button>
                <Button
                  onClick={handleDeclineClick}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Refuser
                </Button>
              </div>
            )}

            {showDeclineForm && (
              <div className="border-t pt-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Refuser la demande
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Motif du refus (optionnel)
                    </label>
                    <textarea
                      id="message"
                      value={declineMessage}
                      onChange={e => setDeclineMessage(e.target.value)}
                      placeholder="Expliquez pourquoi vous refusez cette demande..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleDecline}
                      disabled={isProcessing}
                      variant="destructive"
                    >
                      {isProcessing ? 'Traitement...' : 'Confirmer le refus'}
                    </Button>
                    <Button
                      onClick={() => setShowDeclineForm(false)}
                      variant="outline"
                      disabled={isProcessing}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            )}

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
