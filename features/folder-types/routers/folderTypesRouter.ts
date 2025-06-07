import { publicProcedure, router } from "@/lib/trpc/trpc";
import * as folderTypesRepository from "@/features/folder-types/repository/folderTypesRepository";
import { z } from "zod";

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
})