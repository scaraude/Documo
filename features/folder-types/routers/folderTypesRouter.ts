import { publicProcedure, protectedProcedure, router } from '@/lib/trpc/trpc';
import * as folderTypesRepository from '@/features/folder-types/repository/folderTypesRepository';
import { z } from 'zod';
import { CreateFolderTypeSchema, UpdateFolderTypeSchema } from '../types/zod';
import logger from '@/lib/logger';

export const folderTypesRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      logger.info('Fetching all folder types');
      const result = await folderTypesRepository.getFolderTypes();
      logger.info(
        { count: result.length },
        'Folder types fetched successfully'
      );
      return result;
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : error },
        'Error fetching folder types'
      );
      throw new Error('Failed to fetch folder types');
    }
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        logger.info({ folderTypeId: input.id }, 'Fetching folder type by ID');
        const result = await folderTypesRepository.getFolderTypeById(input.id);
        logger.info(
          { folderTypeId: input.id, found: !!result },
          'Folder type fetch completed'
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderTypeId: input.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching folder type'
        );
        throw new Error('Failed to fetch folder type');
      }
    }),
  create: protectedProcedure
    .input(CreateFolderTypeSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info({ folderTypeName: input.name }, 'Creating folder type');
        const result = await folderTypesRepository.createFolderType({
          ...input,
          createdById: ctx.user.id, // Use authenticated user's ID
        });
        logger.info(
          { folderTypeId: result.id, folderTypeName: result.name },
          'Folder type created successfully'
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderTypeName: input.name,
            error: error instanceof Error ? error.message : error,
          },
          'Error creating folder type'
        );
        throw new Error('Failed to create folder type');
      }
    }),
  isInUsed: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        logger.info({ folderTypeId: input.id }, 'Checking folder type usage');
        const result = await folderTypesRepository.isFolderTypeInUse(input.id);
        logger.info(
          { folderTypeId: input.id, inUse: result },
          'Folder type usage check completed'
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderTypeId: input.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error checking folder type usage'
        );
        throw new Error('Failed to check folder type usage');
      }
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid(), params: UpdateFolderTypeSchema }))
    .mutation(async ({ input }) => {
      try {
        logger.info(
          { folderTypeId: input.id, updateData: input.params },
          'Updating folder type'
        );
        const result = await folderTypesRepository.updateFolderType(
          input.id,
          input.params
        );
        logger.info(
          { folderTypeId: input.id, folderTypeName: result.name },
          'Folder type updated successfully'
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderTypeId: input.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error updating folder type'
        );
        throw new Error('Failed to update folder type');
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        logger.info({ folderTypeId: input.id }, 'Deleting folder type');
        await folderTypesRepository.deleteFolderType(input.id);
        logger.info(
          { folderTypeId: input.id },
          'Folder type deleted successfully'
        );
      } catch (error) {
        logger.error(
          {
            folderTypeId: input.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error deleting folder type'
        );
        throw new Error('Failed to delete folder type');
      }
    }),
});
