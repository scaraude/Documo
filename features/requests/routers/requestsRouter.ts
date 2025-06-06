import { z } from 'zod';
import * as requestRepository from './../repository/requestRepository';
import { APP_DOCUMENT_TYPES } from '@/shared/constants';
import { publicProcedure, router } from '@/lib/trpc/trpc';

// Schéma de validation pour la création de request
const createRequestSchema = z.object({
    civilId: z.string().min(1),
    requestedDocuments: z.nativeEnum(APP_DOCUMENT_TYPES).array(),
    expirationDays: z.number().optional(),
    folderId: z.string().uuid(), // Add folder ID
})

export const requestsRouter = router({
    // GET /api/requests
    list: publicProcedure
        .query(async () => {
            try {
                return await requestRepository.getRequests();
            } catch (error) {
                console.error('Error fetching requests:', error);
                throw new Error('Failed to fetch requests');
            }
        }),

    // POST /api/requests  
    create: publicProcedure
        .input(createRequestSchema)
        .mutation(async ({ input }) => {
            try {
                return await requestRepository.createRequest(input);
            } catch (error) {
                console.error('Error creating request:', error);
                throw new Error('Failed to create request');
            }
        }),
});