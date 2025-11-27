import * as folderTypesRepository from '@/features/folder-types/repository/folderTypesRepository';
import logger from '@/lib/logger';
import { protectedProcedure, router } from '@/lib/trpc/trpc';
import { z } from 'zod';
import { CreateFolderTypeSchema, UpdateFolderTypeSchema } from '../types/zod';

export const folderTypesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.user.id }, 'Fetching folder types for user');
      const result = await folderTypesRepository.getFolderTypesByUserId(
        ctx.user.id,
      );
      logger.info(
        { userId: ctx.user.id, count: result.length },
        'Folder types fetched successfully',
      );
      return result;
    } catch (error) {
      logger.error(
        {
          userId: ctx.user.id,
          error: error instanceof Error ? error.message : error,
        },
        'Error fetching folder types',
      );
      throw new Error('Failed to fetch folder types');
    }
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      try {
        logger.info(
          { folderTypeId: input.id, userId: ctx.user.id },
          'Fetching folder type by ID',
        );
        const result = await folderTypesRepository.getFolderTypeByIdForUser(
          input.id,
          ctx.user.id,
        );
        if (!result) {
          logger.warn(
            { folderTypeId: input.id, userId: ctx.user.id },
            'Folder type not found or access denied',
          );
          throw new Error('Folder type not found or access denied');
        }
        logger.info(
          { folderTypeId: input.id, userId: ctx.user.id },
          'Folder type fetch completed',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderTypeId: input.id,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error fetching folder type',
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
          'Folder type created successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderTypeName: input.name,
            error: error instanceof Error ? error.message : error,
          },
          'Error creating folder type',
        );
        throw new Error('Failed to create folder type');
      }
    }),
  isInUsed: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      try {
        logger.info(
          { folderTypeId: input.id, userId: ctx.user.id },
          'Checking folder type usage',
        );
        // First verify ownership
        const folderType = await folderTypesRepository.getFolderTypeByIdForUser(
          input.id,
          ctx.user.id,
        );
        if (!folderType) {
          logger.warn(
            { folderTypeId: input.id, userId: ctx.user.id },
            'Unauthorized folder type usage check attempt',
          );
          throw new Error('Folder type not found or access denied');
        }
        const result = await folderTypesRepository.isFolderTypeInUse(input.id);
        logger.info(
          { folderTypeId: input.id, userId: ctx.user.id, inUse: result },
          'Folder type usage check completed',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderTypeId: input.id,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error checking folder type usage',
        );
        throw new Error('Failed to check folder type usage');
      }
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid(), params: UpdateFolderTypeSchema }))
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          {
            folderTypeId: input.id,
            userId: ctx.user.id,
            updateData: input.params,
          },
          'Updating folder type',
        );
        // Verify ownership before update
        const folderType = await folderTypesRepository.getFolderTypeByIdForUser(
          input.id,
          ctx.user.id,
        );
        if (!folderType) {
          logger.warn(
            { folderTypeId: input.id, userId: ctx.user.id },
            'Unauthorized folder type update attempt',
          );
          throw new Error('Folder type not found or access denied');
        }
        const result = await folderTypesRepository.updateFolderType(
          input.id,
          input.params,
        );
        logger.info(
          {
            folderTypeId: input.id,
            userId: ctx.user.id,
            folderTypeName: result.name,
          },
          'Folder type updated successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            folderTypeId: input.id,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error updating folder type',
        );
        throw new Error('Failed to update folder type');
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          { folderTypeId: input.id, userId: ctx.user.id },
          'Deleting folder type',
        );
        // Verify ownership before deletion
        const folderType = await folderTypesRepository.getFolderTypeByIdForUser(
          input.id,
          ctx.user.id,
        );
        if (!folderType) {
          logger.warn(
            { folderTypeId: input.id, userId: ctx.user.id },
            'Unauthorized folder type delete attempt',
          );
          throw new Error('Folder type not found or access denied');
        }
        await folderTypesRepository.deleteFolderType(input.id);
        logger.info(
          { folderTypeId: input.id, userId: ctx.user.id },
          'Folder type deleted successfully',
        );
      } catch (error) {
        logger.error(
          {
            folderTypeId: input.id,
            userId: ctx.user.id,
            error: error instanceof Error ? error.message : error,
          },
          'Error deleting folder type',
        );
        throw new Error('Failed to delete folder type');
      }
    }),
});
