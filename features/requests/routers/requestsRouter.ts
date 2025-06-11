import { z } from 'zod';
import * as requestRepository from './../repository/requestRepository';
import { APP_DOCUMENT_TYPES } from '@/shared/constants';
import { publicProcedure, router } from '@/lib/trpc/trpc';
import logger from '@/lib/logger';


// Schéma de validation pour la création de request
const createRequestSchema = z.object({
    civilId: z.string().min(1),
    requestedDocuments: z.nativeEnum(APP_DOCUMENT_TYPES).array(),
    expirationDays: z.number().optional(),
    folderId: z.string().uuid(), // Add folder ID
})

export const requestsRouter = router({
    getAll: publicProcedure
        .query(async () => {
            try {
                logger.info('Fetching all requests');
                const result = await requestRepository.getRequests();
                logger.info({ count: result.length }, 'Requests fetched successfully');
                return result;
            } catch (error) {
                logger.error({ error: error instanceof Error ? error.message : error }, 'Error fetching requests');
                throw new Error('Failed to fetch requests');
            }
        }),

    getById: publicProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
            try {
                logger.info({ requestId: input.id }, 'Fetching request by ID');
                const result = await requestRepository.getRequestById(input.id);
                logger.info({ requestId: input.id, found: !!result }, 'Request fetch completed');
                return result;
            } catch (error) {
                logger.error({ requestId: input.id, error: error instanceof Error ? error.message : error }, 'Error fetching request');
                throw new Error('Failed to fetch request');
            }
        }),

    create: publicProcedure
        .input(createRequestSchema)
        .mutation(async ({ input }) => {
            try {
                logger.info({ civilId: input.civilId, folderId: input.folderId, documentsCount: input.requestedDocuments.length }, 'Creating request');
                const result = await requestRepository.createRequest(input);
                logger.info({ requestId: result.id, civilId: input.civilId }, 'Request created successfully');
                return result;
            } catch (error) {
                logger.error({ civilId: input.civilId, error: error instanceof Error ? error.message : error }, 'Error creating request');
                throw new Error('Failed to create request');
            }
        })
});