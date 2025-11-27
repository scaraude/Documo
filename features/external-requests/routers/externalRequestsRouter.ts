import * as documentRepository from '@/features/documents/repository/documentsRepository';
import * as externalRequestsRepository from '@/features/external-requests/repository/externalRequestsRepository';
import logger from '@/lib/logger';
import { TRPCError } from '@trpc/server';
import { put } from '@vercel/blob';
import { z } from 'zod';
import { publicProcedure, router } from '../../../lib/trpc/trpc';
import { prismaShareLinkToExternalRequest } from '../mapper/mapper';
import {
  externalCreateDocumentSchema,
  externalRequestSchema,
} from '../types/zod';

export const externalRouter = router({
  getRequestByToken: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, 'Token is required'),
      }),
    )
    .output(externalRequestSchema)
    .query(async ({ input }) => {
      try {
        const { token } = input;
        logger.info(
          { token: `${token.substring(0, 8)}...` },
          'Fetching external request by token',
        );

        const shareLink =
          await externalRequestsRepository.getShareLinkByToken(token);
        const request = shareLink?.request;

        if (!request) {
          logger.warn(
            { token: `${token.substring(0, 8)}...` },
            'Request not found for token',
          );
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        logger.info(
          { requestId: request.id, token: `${token.substring(0, 8)}...` },
          'External request fetched successfully',
        );
        // Only return necessary information for external users
        return prismaShareLinkToExternalRequest(shareLink);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          {
            token: `${input.token.substring(0, 8)}...`,
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching external request',
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch request',
        });
      }
    }),

  createDocument: publicProcedure
    .input(externalCreateDocumentSchema)
    .mutation(async ({ input }) => {
      try {
        // Utiliser formData pour gérer les fichiers
        const {
          encryptedFile: file,
          token,
          document: documentData,
          dek,
        } = input;
        logger.info(
          {
            token: `${token.substring(0, 8)}...`,
            documentType: documentData.typeId,
            fileName: documentData.fileName,
          },
          'Creating external document',
        );

        const shareLink =
          await externalRequestsRepository.getShareLinkByToken(token);

        if (!shareLink) {
          logger.warn(
            { token: `${token.substring(0, 8)}...` },
            'Share link not found for document upload',
          );
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        const requestId = shareLink.request.id;

        if (!file || !documentData) {
          logger.error(
            { token: `${token.substring(0, 8)}...` },
            'Missing file or document data',
          );
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'File and document data are missing',
          });
        }

        const blob = new Blob([file], { type: 'application/octet-stream' });

        const { url } = await put(documentData.fileName, blob, {
          access: 'public',
          addRandomSuffix: true,
        });

        logger.info(
          { requestId, documentType: documentData.typeId, url },
          'Document blob uploaded, saving to database',
        );
        // Sauvegarder le document dans la base de données
        const result = await documentRepository.uploadDocument({
          ...documentData,
          requestId,
          url,
          dek,
          typeId: documentData.typeId, // Ensure typeId is set correctly
        });
        logger.info(
          { documentId: result.id, requestId },
          'External document created successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            token: `${input.token.substring(0, 8)}...`,
            error: error instanceof Error ? error.message : error,
          },
          'Error uploading external document',
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload document',
        });
      }
    }),

  generateShareLink: publicProcedure
    .input(
      z.object({
        requestId: z.string().min(1, 'Request ID is required'),
      }),
    )
    .output(
      z.object({
        token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { requestId } = input;
      logger.info({ requestId }, 'Generating share link for request');

      // Store the share token with expiration
      const result = await externalRequestsRepository.createShareLink({
        requestId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry by default
      });

      logger.info({ requestId }, 'Share link generated successfully');
      return result;
    }),

  acceptRequest: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, 'Token is required'),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { token } = input;
        logger.info(
          { token: `${token.substring(0, 8)}...` },
          'Accepting external request',
        );

        const shareLink =
          await externalRequestsRepository.getShareLinkByToken(token);

        if (!shareLink) {
          logger.warn(
            { token: `${token.substring(0, 8)}...` },
            'Share link not found for accept request',
          );
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        const result = await externalRequestsRepository.acceptRequest(
          shareLink.requestId,
        );

        logger.info(
          { requestId: shareLink.requestId },
          'External request accepted successfully',
        );
        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          {
            token: `${input.token.substring(0, 8)}...`,
            error: error instanceof Error ? error.message : error,
          },
          'Error accepting external request',
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to accept request',
        });
      }
    }),

  declineRequest: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, 'Token is required'),
        message: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { token, message } = input;
        logger.info(
          { token: `${token.substring(0, 8)}...`, hasMessage: !!message },
          'Declining external request',
        );

        const shareLink =
          await externalRequestsRepository.getShareLinkByToken(token);

        if (!shareLink) {
          logger.warn(
            { token: `${token.substring(0, 8)}...` },
            'Share link not found for decline request',
          );
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        const result = await externalRequestsRepository.declineRequest(
          shareLink.requestId,
          message,
        );

        logger.info(
          { requestId: shareLink.requestId },
          'External request declined successfully',
        );
        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          {
            token: `${input.token.substring(0, 8)}...`,
            error: error instanceof Error ? error.message : error,
          },
          'Error declining external request',
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to decline request',
        });
      }
    }),
});

export type ExternalRouter = typeof externalRouter;
