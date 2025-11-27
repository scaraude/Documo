import * as documentTypesRepository from '@/features/document-types/repository/documentTypesRepository';
import * as externalRequestsRepository from '@/features/external-requests/repository/externalRequestsRepository';
import * as foldersRepository from '@/features/folders/repository/foldersRepository';
import { sendDocumentRequestEmail } from '@/lib/email';
import logger from '@/lib/logger';
import { protectedProcedure, router } from '@/lib/trpc/trpc';
import { ROUTES } from '../../../shared/constants';
import {
  DeleteRequestSchema,
  RequestIdSchema,
  createRequestSchema,
} from '../types/zod';
import * as requestRepository from './../repository/requestRepository';

export const requestsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.user.id }, 'Fetching all requests for user');
      const result = await requestRepository.getRequestsForUser(ctx.user.id);
      logger.info(
        { userId: ctx.user.id, count: result.length },
        'User requests fetched successfully',
      );
      return result;
    } catch (error) {
      logger.error(
        {
          userId: ctx.user.id,
          error: error instanceof Error ? error.message : error,
        },
        'Error fetching requests for user',
      );
      throw new Error('Failed to fetch requests');
    }
  }),

  getById: protectedProcedure
    .input(RequestIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        logger.info(
          { requestId: input.id, userId: ctx.user.id },
          'Fetching request by ID for user',
        );
        const result = await requestRepository.getRequestByIdForUser(
          input.id,
          ctx.user.id,
        );

        if (!result) {
          logger.warn(
            { requestId: input.id, userId: ctx.user.id },
            'Request not found or user not authorized',
          );
          throw new Error('Request not found or access denied');
        }

        logger.info(
          { requestId: input.id, userId: ctx.user.id },
          'Request fetch completed for user',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            requestId: input.id,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching request for user',
        );
        throw error;
      }
    }),

  create: protectedProcedure
    .input(createRequestSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          {
            email: input.email.replace(/(.{3}).*(@.*)/, '$1...$2'),
            folderId: input.folderId,
            documentsCount: input.requestedDocuments.length,
          },
          'Creating request',
        );

        // Create the request with ownership validation
        const documentRequest = await requestRepository.createRequestForUser(
          input,
          ctx.user.id,
        );

        // Get folder information for the email (ownership already validated in createRequestForUser)
        const folder = await foldersRepository.getFolderByIdForUser(
          input.folderId,
          ctx.user.id,
        );
        if (!folder) {
          throw new Error('Folder not found');
        }

        // Get document types for labels
        const documentTypes =
          await documentTypesRepository.getAllDocumentTypes();
        const documentTypeMap = documentTypes.reduce(
          (acc: Record<string, string>, dt) => {
            acc[dt.id] = dt.label;
            return acc;
          },
          {} as Record<string, string>,
        );
        // Store the share token with expiration
        const result = await externalRequestsRepository.createShareLink({
          requestId: documentRequest.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry by default
        });
        // Prepare email data
        const documentLabels = input.requestedDocuments.map(
          (docTypeId) => documentTypeMap[docTypeId] || docTypeId,
        );

        const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.EXTERNAL.REQUEST(result.token)}`;
        const expirationDate = new Intl.DateTimeFormat('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(result.expiresAt);

        // Send email
        const emailResult = await sendDocumentRequestEmail({
          to: input.email,
          requestedDocuments: documentLabels,
          uploadUrl,
          expirationDate,
          folderName: folder.name,
        });

        if (!emailResult.success) {
          logger.warn(
            {
              requestId: result.id,
              email: input.email.replace(/(.{3}).*(@.*)/, '$1...$2'),
              error: emailResult.error,
            },
            'Request created but email failed to send',
          );
        }

        logger.info(
          {
            requestId: result.id,
            email: input.email.replace(/(.{3}).*(@.*)/, '$1...$2'),
            emailSent: emailResult.success,
          },
          'Request created successfully',
        );

        return result;
      } catch (error) {
        logger.error(
          {
            email: input.email.replace(/(.{3}).*(@.*)/, '$1...$2'),
            error: error instanceof Error ? error.message : error,
          },
          'Error creating request',
        );
        throw new Error('Failed to create request');
      }
    }),

  delete: protectedProcedure
    .input(DeleteRequestSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          { requestId: input.id, userId: ctx.user.id },
          'Deleting request for user',
        );

        // Use security-aware delete function
        await requestRepository.deleteRequestForUser(input.id, ctx.user.id);

        logger.info(
          { requestId: input.id, userId: ctx.user.id },
          'Request deleted successfully for user',
        );
      } catch (error) {
        logger.error(
          {
            requestId: input.id,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error deleting request for user',
        );
        throw error;
      }
    }),
});
