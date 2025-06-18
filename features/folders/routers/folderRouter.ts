import { z } from 'zod';
import { publicProcedure, router } from '../../../lib/trpc/trpc';
import * as folderRepository from '../repository/foldersRepository';
import { CreateFolderSchema } from '../types/zod';
import logger from '@/lib/logger';

export const folderRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      logger.info('Fetching all folders');
      const result = await folderRepository.getFolders();
      logger.info({ count: result.length }, 'Folders fetched successfully');
      return result;
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : error },
        'Error fetching folders'
      );
      throw new Error('Failed to fetch folders');
    }
  }),
  getByIdWithRelations: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        logger.info(
          { folderId: input.id },
          'Fetching folder by ID with relations'
        );
        const result = await folderRepository.getFolderByIdWithRelations(
          input.id
        );
        logger.info(
          { folderId: input.id, found: !!result },
          'Folder fetch completed'
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderId: input.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching folder'
        );
        throw new Error('Failed to fetch folder');
      }
    }),
  create: publicProcedure
    .input(CreateFolderSchema)
    .mutation(async ({ input }) => {
      try {
        logger.info(
          { folderName: input.name, folderTypeId: input.folderTypeId },
          'Creating folder'
        );
        const result = await folderRepository.createFolder(input);
        logger.info(
          { folderId: result.id, folderName: result.name },
          'Folder created successfully'
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderName: input.name,
            error: error instanceof Error ? error.message : error,
          },
          'Error creating folder'
        );
        throw new Error('Failed to create folder');
      }
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        logger.info({ folderId: input.id }, 'Deleting folder');
        await folderRepository.deleteFolder(input.id);
        logger.info({ folderId: input.id }, 'Folder deleted successfully');
      } catch (error) {
        logger.error(
          {
            folderId: input.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error deleting folder'
        );
        throw new Error('Failed to delete folder');
      }
    }),
  removeRequestFromFolder: publicProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        logger.info(
          { requestId: input.requestId },
          'Removing request from folder'
        );
        await folderRepository.removeRequestFromFolder(input.requestId);
        logger.info(
          { requestId: input.requestId },
          'Request removed from folder successfully'
        );
      } catch (error) {
        logger.error(
          {
            requestId: input.requestId,
            error: error instanceof Error ? error.message : error,
          },
          'Error removing request from folder'
        );
        throw new Error('Failed to remove request from folder');
      }
    }),
});
