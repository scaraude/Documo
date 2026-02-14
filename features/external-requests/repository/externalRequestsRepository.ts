// features/external-requests/repository/externalRequestsRepository.ts
import { prisma } from '@/lib/prisma';
import { generateSecureToken } from '../../../lib/utils';
import type { CreateShareLinkParams } from '../types/api';

/**
 * Create a new share link for a request
 */
export async function createShareLink(params: CreateShareLinkParams) {
  const token = await generateSecureToken();

  return await prisma.requestShareLink.create({
    data: {
      requestId: params.requestId,
      token,
      expiresAt: params.expiresAt,
    },
  });
}

/**
 * Get a share link by token
 */
export async function getShareLinkByToken(token: string) {
  return await prisma.requestShareLink.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(), // Only return non-expired tokens
      },
    },
    include: {
      request: {
        include: {
          requestedDocuments: true,
          folder: {
            include: {
              createdByOrganization: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Delete expired share links
 */
export async function deleteExpiredShareLinks() {
  return await prisma.requestShareLink.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}

/**
 * Accept a document request
 */
export async function acceptRequest(requestId: string) {
  return await prisma.documentRequest.update({
    where: { id: requestId },
    data: {
      acceptedAt: new Date(),
      // Keep existing email from the request - no need to update
    },
  });
}

/**
 * Decline a document request
 */
export async function declineRequest(requestId: string, message?: string) {
  return await prisma.documentRequest.update({
    where: { id: requestId },
    data: {
      rejectedAt: new Date(),
      declineMessage: message,
    },
  });
}
