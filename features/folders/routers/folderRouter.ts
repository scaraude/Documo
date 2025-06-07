import { z } from "zod";
import { publicProcedure, router } from "../../../lib/trpc/trpc";
import * as folderRepository from "../repository/foldersRepository";
import { CreateFolderSchema } from "../types/zod";

export const folderRouter = router({
    getAll: publicProcedure.query(async () => {
        try {
            return await folderRepository.getFolders();
        } catch (error) {
            console.error('Error fetching folders:', error);
            throw new Error('Failed to fetch folders');
        }
    }),
    getByIdWithRelations: publicProcedure.input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
            try {
                return await folderRepository.getFolderByIdWithRelations(input.id);
            } catch (error) {
                console.error('Error fetching folder:', error);
                throw new Error('Failed to fetch folder');
            }
        }),
    create: publicProcedure.input(CreateFolderSchema)
        .mutation(async ({ input }) => {
            try {
                return await folderRepository.createFolder(input);
            } catch (error) {
                console.error('Error creating folder:', error);
                throw new Error('Failed to create folder');
            }
        }),
    delete: publicProcedure.input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input }) => {
            try {
                return await folderRepository.deleteFolder(input.id);
            } catch (error) {
                console.error('Error deleting folder:', error);
                throw new Error('Failed to delete folder');
            }
        }),
    removeRequestFromFolder: publicProcedure.input(z.object({ requestId: z.string().uuid() }))
        .mutation(async ({ input }) => {
            try {
                return await folderRepository.removeRequestFromFolder(input.requestId);
            } catch (error) {
                console.error('Error removing request from folder:', error);
                throw new Error('Failed to remove request from folder');
            }
        }),
})