import type { z } from 'zod';
import { Prisma } from '../../../lib/prisma';
import { documentTypeToAppDocumentType } from '../../../shared/mapper/prismaMapper';
import type { externalRequestSchema } from '../types/zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const shareLinkWithRequest =
  Prisma.validator<Prisma.RequestShareLinkDefaultArgs>()({
    include: { request: { include: { requestedDocuments: true } } },
  });

export const prismaShareLinkToExternalRequest = (
  shareLink: Prisma.RequestShareLinkGetPayload<typeof shareLinkWithRequest>,
): z.infer<typeof externalRequestSchema> => {
  const request = shareLink.request;
  return {
    id: request.id,
    email: request.email,
    requestedDocuments: request.requestedDocuments.map(
      documentTypeToAppDocumentType,
    ),
    createdAt: request.createdAt,
    expiresAt: request.expiresAt,
    acceptedAt: request.acceptedAt,
    rejectedAt: request.rejectedAt,
    declineMessage: request.declineMessage,
  };
};
