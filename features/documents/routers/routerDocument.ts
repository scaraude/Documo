import { z } from "zod";
import { publicProcedure, router } from "../../../lib/trpc/trpc";
import * as repository from "../repository/documentsRepository";
import logger from "@/lib/logger";

export const routerDocument = router({
    getValidDocumentsByRequestId: publicProcedure.input(z.object({ requestId: z.string().uuid() }))
        .query(async ({ input }) => {
            try {
                const { requestId } = input;
                logger.info({ requestId }, 'Fetching valid documents by request ID');
                const result = await repository.getValidDocumentsByRequestId(requestId);
                logger.info({ requestId, count: result.length }, 'Valid documents fetched successfully');
                return result;
            } catch (error) {
                logger.error({ requestId: input.requestId, error: error instanceof Error ? error.message : error }, 'Error fetching valid documents by request ID');
                throw new Error('Failed to fetch documents');
            }
        }),
    getValidDocumentsByRequestIds: publicProcedure.input(z.object({ requestIds: z.array(z.string().uuid()) }))
        .query(async ({ input }) => {
            try {
                const { requestIds } = input;
                logger.info({ requestIds, count: requestIds.length }, 'Fetching valid documents by multiple request IDs');
                const result = await repository.getValidDocumentsByRequestIds(requestIds);
                logger.info({ requestIdsCount: requestIds.length, documentsCount: result.length }, 'Valid documents fetched successfully for multiple requests');
                return result;
            } catch (error) {
                logger.error({ requestIds: input.requestIds, error: error instanceof Error ? error.message : error }, 'Error fetching valid documents by request IDs');
                throw new Error('Failed to fetch documents');
            }
        }),
})
