import { z } from 'zod';
import * as externalRequestsRepository from '@/features/external-requests/repository/externalRequestsRepository';
import * as documentRepository from '@/features/documents/repository/documentsRepository';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../../../lib/trpc/trpc';
import {
  externalCreateDocumentSchema,
  externalRequestSchema,
} from '../types/zod';
import { prismaShareLinkToExternalRequest } from '../mapper/mapper';
import { generateSecureToken } from '../../../lib/utils';
import { put } from '@vercel/blob';
import logger from '@/lib/logger';

export const externalRouter = router({
  getRequestByToken: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, 'Token is required'),
      })
    )
    .output(externalRequestSchema)
    .query(async ({ input }) => {
      try {
        const { token } = input;
        logger.info(
          { token: token.substring(0, 8) + '...' },
          'Fetching external request by token'
        );

        const shareLink =
          await externalRequestsRepository.getShareLinkByToken(token);
        const request = shareLink?.request;

        if (!request) {
          logger.warn(
            { token: token.substring(0, 8) + '...' },
            'Request not found for token'
          );
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        logger.info(
          { requestId: request.id, token: token.substring(0, 8) + '...' },
          'External request fetched successfully'
        );
        // Only return necessary information for external users
        return prismaShareLinkToExternalRequest(shareLink);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error(
          {
            token: input.token.substring(0, 8) + '...',
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching external request'
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
            token: token.substring(0, 8) + '...',
            documentType: documentData.typeId,
            fileName: documentData.fileName,
          },
          'Creating external document'
        );

        const shareLink =
          await externalRequestsRepository.getShareLinkByToken(token);

        if (!shareLink) {
          logger.warn(
            { token: token.substring(0, 8) + '...' },
            'Share link not found for document upload'
          );
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        const requestId = shareLink.request.id;

        if (!file || !documentData) {
          logger.error(
            { token: token.substring(0, 8) + '...' },
            'Missing file or document data'
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
          'Document blob uploaded, saving to database'
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
          'External document created successfully'
        );
        return result;
      } catch (error) {
        logger.error(
          {
            token: input.token.substring(0, 8) + '...',
            error: error instanceof Error ? error.message : error,
          },
          'Error uploading external document'
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
      })
    )
    .output(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { requestId } = input;
      logger.info({ requestId }, 'Generating share link for request');

      // Generate a secure token that will be used to identify this shared request
      const token = await generateSecureToken();

      // Store the share token with expiration
      const result = await externalRequestsRepository.createShareLink({
        requestId,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry by default
      });

      logger.info(
        { requestId, token: token.substring(0, 8) + '...' },
        'Share link generated successfully'
      );
      return result;
    }),
});

export type ExternalRouter = typeof externalRouter;
