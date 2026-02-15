'use client';

import { useDocumentTypes } from '@/features/document-types/hooks/useDocumentTypes';
import { useDecryptedDocument } from '@/features/documents/hooks/useDecryptedDocument';
import { useDocument } from '@/features/documents/hooks/useDocument';
import { useRequests } from '@/features/requests';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { ROUTES } from '@/shared/constants';
import type { AppDocument } from '@/shared/types';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RotateCcw,
  XCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

function DocumentControlWorkspace({
  document,
}: {
  document: AppDocument;
}) {
  const router = useRouter();
  const params: { id: string } = useParams();
  const { getLabelById } = useDocumentTypes();
  const { validateDocumentMutation, invalidateDocumentMutation } =
    useDocument();
  const { objectUrl, isLoading, error, decryptDocument } =
    useDecryptedDocument(document);

  const [zoom, setZoom] = useState(100);
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const canZoom = !!objectUrl && document.mimeType.startsWith('image/');

  const isMutating =
    validateDocumentMutation.isPending || invalidateDocumentMutation.isPending;

  const backToRequest = () => {
    router.push(`${ROUTES.REQUESTS.DETAIL(params.id)}?tab=documents`);
  };

  const handleValidate = async () => {
    try {
      await validateDocumentMutation.mutateAsync({ documentId: document.id });
      toast.success('Document valide');
      backToRequest();
    } catch {
      toast.error('Impossible de valider le document');
    }
  };

  const handleInvalidate = async () => {
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      toast.error('Le motif est obligatoire');
      return;
    }

    try {
      await invalidateDocumentMutation.mutateAsync({
        documentId: document.id,
        reason: trimmedReason,
      });
      toast.success('Document refuse, email envoye');
      backToRequest();
    } catch {
      toast.error('Impossible de refuser le document');
    }
  };

  const zoomOut = () => setZoom((previous) => Math.max(50, previous - 10));
  const zoomIn = () => setZoom((previous) => Math.min(250, previous + 10));
  const resetZoom = () => setZoom(100);

  const renderDocument = () => {
    if (isLoading) {
      return (
        <div className="h-[65vh] flex flex-col items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-gray-500" />
          <p className="text-sm text-gray-600 mt-2">
            Dechiffrement du document...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-[65vh] flex flex-col items-center justify-center">
          <p className="text-sm text-red-600">{error}</p>
          <Button className="mt-4" onClick={decryptDocument}>
            Reessayer
          </Button>
        </div>
      );
    }

    if (!objectUrl) {
      return (
        <div className="h-[65vh] flex items-center justify-center">
          <p className="text-sm text-gray-500">
            Apercu indisponible pour le moment.
          </p>
        </div>
      );
    }

    if (document.mimeType.startsWith('image/')) {
      return (
        <div className="h-[65vh] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div
            className="mx-auto transition-transform duration-150"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              width: 'fit-content',
            }}
          >
            <Image
              src={objectUrl}
              alt={document.fileName}
              width={1200}
              height={1600}
              className="h-auto w-auto max-w-none rounded-md shadow-sm"
            />
          </div>
        </div>
      );
    }

    if (document.mimeType === 'application/pdf') {
      return (
        <iframe
          src={`${objectUrl}#zoom=${zoom}`}
          className="h-[65vh] w-full rounded-lg border border-gray-200 bg-white"
          title={document.fileName}
        />
      );
    }

    return (
      <div className="h-[65vh] flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
        <p className="text-sm text-gray-500">
          Apercu non disponible pour ce format.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-36 space-y-6">
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={backToRequest}
          className="text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour a la demande
        </Button>
      </div>

      {!isRejecting && (
        <Card className="relative">
          <CardHeader>
            <CardTitle>{getLabelById(document.typeId)}</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {renderDocument()}

            {canZoom && (
              <div className="pointer-events-none absolute right-6 top-6 z-10">
                <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/95 p-1 shadow-sm backdrop-blur">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={zoomOut}
                    aria-label="Zoom out"
                    className="size-8"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="min-w-12 text-center text-xs font-medium text-gray-600">
                    {zoom}%
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={zoomIn}
                    aria-label="Zoom in"
                    className="size-8"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={resetZoom}
                    aria-label="Reset zoom"
                    className="size-8"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isRejecting && (
        <Card className="border-red-200 bg-red-50/60">
          <CardContent className="pt-6">
            <label
              htmlFor="invalid-reason"
              className="block text-sm font-medium text-red-900 mb-1"
            >
              Motif du refus
            </label>
            <textarea
              id="invalid-reason"
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Exemple: piece illisible, document expire, information incomplete..."
              className="w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={handleInvalidate}
                disabled={isMutating}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmer le refus
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsRejecting(false);
                  setReason('');
                }}
                disabled={isMutating}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isRejecting && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRejecting((previous) => !previous)}
              disabled={isMutating}
              className={'border-red-300 text-red-700 hover:bg-red-50'}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Refuser
            </Button>

            <Button
              type="button"
              onClick={handleValidate}
              disabled={isMutating}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Valider
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocumentControlPage() {
  const params: { id: string; documentId: string } = useParams();
  const { getById } = useRequests();
  const { data: request, isLoading, error } = getById(params.id);

  const document = useMemo(
    () => request?.documents?.find((item) => item.id === params.documentId),
    [request, params.documentId],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-lg w-full">
          <CardContent className="py-10 text-center">
            <p className="text-red-600">Demande introuvable.</p>
            <Link href={ROUTES.REQUESTS.HOME} className="inline-block mt-4">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux demandes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-lg w-full">
          <CardContent className="py-10 text-center">
            <p className="text-red-600">Document introuvable.</p>
            <Link
              href={`${ROUTES.REQUESTS.DETAIL(params.id)}?tab=documents`}
              className="inline-block mt-4"
            >
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour a la demande
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <DocumentControlWorkspace document={document} />;
}
