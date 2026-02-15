import { trpc } from '../../../lib/trpc/client';
import { computeDocumentStatus } from '../../../shared/utils';

export const useDocument = () => {
  const utils = trpc.useUtils();

  const getDocumentsByRequestId = (requestId?: string) =>
    trpc.documents.getValidDocumentsByRequestId.useQuery(
      {
        requestId: requestId || '',
      },
      {
        enabled: !!requestId,
        select: (documents) =>
          documents.map((document) => {
            return { ...document, status: computeDocumentStatus(document) };
          }),
      },
    );

  const getDocumentsByRequestIds = (requestIds: string[]) =>
    trpc.documents.getValidDocumentsByRequestIds.useQuery(
      {
        requestIds,
      },
      {
        enabled: requestIds.length > 0,
        select: (documents) =>
          documents.map((document) => {
            return { ...document, status: computeDocumentStatus(document) };
          }),
      },
    );

  const validateDocumentMutation = trpc.documents.validate.useMutation({
    onSuccess: async (document) => {
      await Promise.all([
        utils.requests.getById.invalidate({ id: document.requestId }),
        utils.requests.getAll.invalidate(),
        utils.folder.getAll.invalidate(),
        utils.folder.getByIdWithRelations.invalidate(),
        utils.documents.getValidDocumentsByRequestId.invalidate({
          requestId: document.requestId,
        }),
        utils.documents.getValidDocumentsByRequestIds.invalidate(),
      ]);
    },
  });

  const invalidateDocumentMutation = trpc.documents.invalidate.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.requests.getAll.invalidate(),
        utils.requests.getById.invalidate(),
        utils.folder.getAll.invalidate(),
        utils.folder.getByIdWithRelations.invalidate(),
        utils.documents.getValidDocumentsByRequestId.invalidate(),
        utils.documents.getValidDocumentsByRequestIds.invalidate(),
      ]);
    },
  });

  return {
    getDocumentsByRequestId,
    getDocumentsByRequestIds,
    validateDocumentMutation,
    invalidateDocumentMutation,
  };
};
