import { env } from '@/lib/config/env';
import { sendDocumentInvalidatedEmail } from '@/lib/email';
import logger from '@/lib/logger';
import { ROUTES } from '@/shared/constants';
import { z } from 'zod';
import { protectedProcedure, router } from '../../../lib/trpc/trpc';
import * as repository from '../repository/documentsRepository';

export const routerDocument = router({
  getValidDocumentsByRequestId: protectedProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        const { requestId } = input;
        logger.info({ requestId }, 'Fetching valid documents by request ID');
        const result = await repository.getValidDocumentsByRequestId(requestId);
        logger.info(
          { requestId, count: result.length },
          'Valid documents fetched successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            requestId: input.requestId,
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching valid documents by request ID',
        );
        throw new Error('Failed to fetch documents');
      }
    }),
  getValidDocumentsByRequestIds: protectedProcedure
    .input(z.object({ requestIds: z.array(z.string().uuid()) }))
    .query(async ({ input }) => {
      try {
        const { requestIds } = input;
        logger.info(
          { requestIds, count: requestIds.length },
          'Fetching valid documents by multiple request IDs',
        );
        const result =
          await repository.getValidDocumentsByRequestIds(requestIds);
        logger.info(
          { requestIdsCount: requestIds.length, documentsCount: result.length },
          'Valid documents fetched successfully for multiple requests',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            requestIds: input.requestIds,
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching valid documents by request IDs',
        );
        throw new Error('Failed to fetch documents');
      }
    }),
  validate: protectedProcedure
    .input(z.object({ documentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          {
            documentId: input.documentId,
            organizationId: ctx.organization.id,
          },
          'Validating document',
        );

        const result = await repository.validateDocumentForUser(
          input.documentId,
          ctx.organization.id,
        );

        logger.info(
          { documentId: input.documentId, requestId: result.requestId },
          'Document validated successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            documentId: input.documentId,
            organizationId: ctx.organization.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error validating document',
        );
        throw new Error('Failed to validate document');
      }
    }),
  invalidate: protectedProcedure
    .input(
      z.object({
        documentId: z.string().uuid(),
        reason: z.string().trim().min(1, 'Reason is required').max(1000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          {
            documentId: input.documentId,
            organizationId: ctx.organization.id,
          },
          'Invalidating document',
        );

        const result = await repository.invalidateDocumentForUser(
          input.documentId,
          ctx.organization.id,
          input.reason,
        );

        const uploadUrl = `${env.NEXT_PUBLIC_APP_URL}${ROUTES.EXTERNAL.UPLOAD(result.uploadToken)}`;

        const emailResult = await sendDocumentInvalidatedEmail({
          to: result.requestEmail,
          organizationName: result.organizationName,
          folderName: result.folderName,
          documentLabel: result.documentTypeLabel,
          reason: result.reason,
          uploadUrl,
        });

        if (!emailResult.success) {
          logger.warn(
            {
              requestId: result.requestId,
              email: result.requestEmail.replace(/(.{3}).*(@.*)/, '$1...$2'),
              error: emailResult.error,
            },
            'Document invalidated but email failed to send',
          );
        }

        logger.info(
          {
            documentId: input.documentId,
            requestId: result.requestId,
            emailSent: emailResult.success,
          },
          'Document invalidated successfully',
        );

        return { success: true };
      } catch (error) {
        logger.error(
          {
            documentId: input.documentId,
            organizationId: ctx.organization.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error invalidating document',
        );
        throw new Error('Failed to invalidate document');
      }
    }),
});
