import { publicProcedure, router } from "@/lib/trpc/trpc";
import * as folderTypesRepository from "@/features/folder-types/repository/folderTypesRepository";

export const folderTypesRouter = router({
    getAll: publicProcedure.query(async () => {
        try {
            return await folderTypesRepository.getFolderTypes();
        } catch (error) {
            console.error('Error fetching folder types:', error);
            throw new Error('Failed to fetch folder types');
        }
    })
})