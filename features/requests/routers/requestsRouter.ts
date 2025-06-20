import { z } from 'zod';
import * as requestRepository from './../repository/requestRepository';
import * as foldersRepository from '@/features/folders/repository/foldersRepository';
import { protectedProcedure, router } from '@/lib/trpc/trpc';
import { sendDocumentRequestEmail } from '@/lib/email';
import * as documentTypesRepository from '@/features/document-types/repository/documentTypesRepository';
import logger from '@/lib/logger';
import { createRequestSchema } from '../types/zod';

export const requestsRouter = router({
  getAll: protectedProcedure.query(async () => {
    try {
      logger.info('Fetching all requests');
      const result = await requestRepository.getRequests();
      logger.info({ count: result.length }, 'Requests fetched successfully');
      return result;
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : error },
        'Error fetching requests'
      );
      throw new Error('Failed to fetch requests');
    }
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        logger.info({ requestId: input.id }, 'Fetching request by ID');
        const result = await requestRepository.getRequestById(input.id);
        logger.info(
          { requestId: input.id, found: !!result },
          'Request fetch completed'
        );
        return result;
      } catch (error) {
        logger.error(
          {
            requestId: input.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching request'
        );
        throw new Error('Failed to fetch request');
      }
    }),

  create: protectedProcedure
    .input(createRequestSchema)
    .mutation(async ({ input }) => {
      try {
        logger.info(
          {
            email: input.email.replace(/(.{3}).*(@.*)/, '$1...$2'),
            folderId: input.folderId,
            documentsCount: input.requestedDocuments.length,
          },
          'Creating request'
        );

        // Create the request
        const result = await requestRepository.createRequest(input);

        // Get folder information for the email
        const folder = await foldersRepository.getFolderById(input.folderId);
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
          {} as Record<string, string>
        );

        // Prepare email data
        const documentLabels = input.requestedDocuments.map(
          docTypeId => documentTypeMap[docTypeId] || docTypeId
        );
        const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/requests/${result.id}/upload`;
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
            'Request created but email failed to send'
          );
        }

        logger.info(
          {
            requestId: result.id,
            email: input.email.replace(/(.{3}).*(@.*)/, '$1...$2'),
            emailSent: emailResult.success,
          },
          'Request created successfully'
        );

        return result;
      } catch (error) {
        logger.error(
          {
            email: input.email.replace(/(.{3}).*(@.*)/, '$1...$2'),
            error: error instanceof Error ? error.message : error,
          },
          'Error creating request'
        );
        throw new Error('Failed to create request');
      }
    }),
});
