import type { z } from 'zod';
import { Prisma } from '../../../lib/prisma';
import type { externalRequestSchema } from '../types/zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const shareLinkWithRequest =
  Prisma.validator<Prisma.RequestShareLinkDefaultArgs>()({
    include: {
      request: {
        include: {
          requestedDocuments: true,
          folder: { include: { createdBy: true } },
        },
      },
    },
  });

export const prismaShareLinkToExternalRequest = (
  shareLink: Prisma.RequestShareLinkGetPayload<typeof shareLinkWithRequest>,
): z.infer<typeof externalRequestSchema> => {
  const request = shareLink.request;
  const createdBy = request.folder.createdBy;
  const requesterName =
    createdBy.firstName && createdBy.lastName
      ? `${createdBy.firstName} ${createdBy.lastName}`
      : createdBy.email.split('@')[0];

  return {
    id: request.id,
    email: request.email,
    requestedDocumentIds: request.requestedDocuments.map((dt) => dt.id),
    createdAt: request.createdAt,
    expiresAt: request.expiresAt,
    acceptedAt: request.acceptedAt,
    rejectedAt: request.rejectedAt,
    declineMessage: request.declineMessage,
    folderName: request.folder.name,
    requesterName,
    requesterEmail: createdBy.email,
  };
};
