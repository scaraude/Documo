import logger from '@/lib/logger';
import type { AppDocumentType } from '@/shared/constants';
import { protectedProcedure, router } from '../../../lib/trpc/trpc';
import * as folderRepository from '../repository/foldersRepository';
import {
  AddRequestToFolderSchema,
  CreateFolderSchema,
  FolderIdSchema,
  RequestIdSchema,
  UpdateFolderInputSchema,
} from '../types/zod';

export const folderRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.user.id }, 'Fetching user folders');
      const result = await folderRepository.getFoldersByUserId(ctx.user.id);
      logger.info(
        { userId: ctx.user.id, count: result.length },
        'User folders fetched successfully',
      );
      return result;
    } catch (error) {
      logger.error(
        {
          userId: ctx.user.id,
          error: error instanceof Error ? error.message : error,
        },
        'Error fetching user folders',
      );
      throw new Error('Failed to fetch folders');
    }
  }),
  getByIdWithRelations: protectedProcedure
    .input(FolderIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        logger.info(
          { folderId: input.id, userId: ctx.user.id },
          'Fetching folder by ID with relations',
        );
        const result = await folderRepository.getFolderByIdWithRelationsForUser(
          input.id,
          ctx.user.id,
        );

        if (!result) {
          logger.warn(
            { folderId: input.id, userId: ctx.user.id },
            'Folder not found or user not authorized',
          );
          throw new Error('Folder not found or access denied');
        }

        logger.info(
          { folderId: input.id, userId: ctx.user.id },
          'Folder fetch completed',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderId: input.id,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching folder',
        );
        throw error;
      }
    }),
  create: protectedProcedure
    .input(CreateFolderSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          { folderName: input.name, folderTypeId: input.folderTypeId },
          'Creating folder',
        );
        const result = await folderRepository.createFolder({
          ...input,
          requestedDocumentIds: input.requestedDocumentIds,
          createdById: ctx.user.id, // Use authenticated user's ID
        });
        logger.info(
          { folderId: result.id, folderName: result.name },
          'Folder created successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderName: input.name,
            error: error instanceof Error ? error.message : error,
          },
          'Error creating folder',
        );
        throw new Error('Failed to create folder');
      }
    }),
  update: protectedProcedure
    .input(UpdateFolderInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          { folderId: input.id, userId: ctx.user.id },
          'Updating folder',
        );

        const result = await folderRepository.updateFolderForUser(
          input.id,
          ctx.user.id,
          {
            ...input.data,
            requestedDocuments: input.data
              .requestedDocuments as AppDocumentType[],
          },
        );

        logger.info(
          { folderId: input.id, userId: ctx.user.id },
          'Folder updated successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderId: input.id,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error updating folder',
        );
        throw error;
      }
    }),
  addRequestToFolder: protectedProcedure
    .input(AddRequestToFolderSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          {
            folderId: input.folderId,
            requestId: input.requestId,
            userId: ctx.user.id,
          },
          'Adding request to folder',
        );

        await folderRepository.addRequestToFolderForUser(
          input.folderId,
          input.requestId,
          ctx.user.id,
        );

        logger.info(
          {
            folderId: input.folderId,
            requestId: input.requestId,
            userId: ctx.user.id,
          },
          'Request added to folder successfully',
        );
      } catch (error) {
        logger.error(
          {
            folderId: input.folderId,
            requestId: input.requestId,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error adding request to folder',
        );
        throw error;
      }
    }),
  getWithStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.user.id }, 'Fetching user folders with stats');
      const result = await folderRepository.getFoldersWithStatsForUser(
        ctx.user.id,
      );
      logger.info(
        { userId: ctx.user.id, count: result.length },
        'User folders with stats fetched successfully',
      );
      return result;
    } catch (error) {
      logger.error(
        {
          userId: ctx.user.id,
          error: error instanceof Error ? error.message : error,
        },
        'Error fetching user folders with stats',
      );
      throw new Error('Failed to fetch folders with stats');
    }
  }),
  delete: protectedProcedure
    .input(FolderIdSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          { folderId: input.id, userId: ctx.user.id },
          'Deleting folder',
        );

        // Check ownership before deletion
        const folder = await folderRepository.getFolderByIdForUser(
          input.id,
          ctx.user.id,
        );
        if (!folder) {
          logger.warn(
            { folderId: input.id, userId: ctx.user.id },
            'Folder not found or user not authorized to delete',
          );
          throw new Error('Folder not found or access denied');
        }

        await folderRepository.deleteFolder(input.id);
        logger.info(
          { folderId: input.id, userId: ctx.user.id },
          'Folder deleted successfully',
        );
      } catch (error) {
        logger.error(
          {
            folderId: input.id,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error deleting folder',
        );
        throw error;
      }
    }),
  removeRequestFromFolder: protectedProcedure
    .input(RequestIdSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          { requestId: input.requestId, userId: ctx.user.id },
          'Removing request from folder',
        );

        // Check if user owns the folder containing this request
        const hasAccess = await folderRepository.userOwnsRequestFolder(
          input.requestId,
          ctx.user.id,
        );
        if (!hasAccess) {
          logger.warn(
            { requestId: input.requestId, userId: ctx.user.id },
            'User not authorized to remove request from folder',
          );
          throw new Error('Request not found or access denied');
        }

        await folderRepository.removeRequestFromFolder(input.requestId);
        logger.info(
          { requestId: input.requestId, userId: ctx.user.id },
          'Request removed from folder successfully',
        );
      } catch (error) {
        logger.error(
          {
            requestId: input.requestId,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error removing request from folder',
        );
        throw error;
      }
    }),
});
