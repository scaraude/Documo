import { trpc } from '../../../lib/trpc/client';
import { computeDocumentStatus } from '../../../shared/utils';

export const useDocument = () => {
  const getDocumentsByRequestId = (requestId?: string) =>
    trpc.documents.getValidDocumentsByRequestId.useQuery(
      {
        requestId: requestId || '',
      },
      {
        enabled: !!requestId,
        select: documents =>
          documents.map(document => {
            return { ...document, status: computeDocumentStatus(document) };
          }),
      }
    );

  const getDocumentsByRequestIds = (requestIds: string[]) =>
    trpc.documents.getValidDocumentsByRequestIds.useQuery(
      {
        requestIds,
      },
      {
        enabled: requestIds.length > 0,
        select: documents =>
          documents.map(document => {
            return { ...document, status: computeDocumentStatus(document) };
          }),
      }
    );

  return {
    getDocumentsByRequestId,
    getDocumentsByRequestIds,
  };
};
