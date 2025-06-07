import { publicProcedure, router } from "@/lib/trpc/trpc";
import * as folderTypesRepository from "@/features/folder-types/repository/folderTypesRepository";
import { z } from "zod";
import { CreateFolderTypeSchema, UpdateFolderTypeSchema } from "../types/zod";

export const folderTypesRouter = router({
    getAll: publicProcedure.query(async () => {
        try {
            return await folderTypesRepository.getFolderTypes();
        } catch (error) {
            console.error('Error fetching folder types:', error);
            throw new Error('Failed to fetch folder types');
        }
    }),
    getById: publicProcedure.input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
            try {
                return await folderTypesRepository.getFolderTypeById(input.id);
            } catch (error) {
                console.error('Error fetching folder type:', error);
                throw new Error('Failed to fetch folder type');
            }
        }),
    create: publicProcedure.input(CreateFolderTypeSchema)
        .mutation(async ({ input }) => {
            try {
                return await folderTypesRepository.createFolderType(input);
            } catch (error) {
                console.error('Error creating folder type:', error);
                throw new Error('Failed to create folder type');
            }
        }),
    isInUsed: publicProcedure.input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
            try {
                return await folderTypesRepository.isFolderTypeInUse(input.id);
            } catch (error) {
                console.error('Error checking folder type usage:', error);
                throw new Error('Failed to check folder type usage');
            }
        }),
    update: publicProcedure.input(z.object({ id: z.string().uuid(), params: UpdateFolderTypeSchema }))
        .mutation(async ({ input }) => {
            try {
                return await folderTypesRepository.updateFolderType(input.id, input.params);
            } catch (error) {
                console.error('Error updating folder type:', error);
                throw new Error('Failed to update folder type');
            }
        }),
    delete: publicProcedure.input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input }) => {
            try {
                return await folderTypesRepository.deleteFolderType(input.id);
            } catch (error) {
                console.error('Error deleting folder type:', error);
                throw new Error('Failed to delete folder type');
            }
        }),
})