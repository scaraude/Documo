// features/external-requests/repository/externalRequestsRepository.ts
import prisma from '@/lib/prisma';
import { CreateShareLinkParams } from '../types/api';

/**
 * Create a new share link for a request
 */
export async function createShareLink(params: CreateShareLinkParams) {
  return await prisma.requestShareLink.create({
    data: {
      requestId: params.requestId,
      token: params.token,
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
          requestedDocuments: true, // <-- Ensure this line is present
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
