import { z } from "zod";
import { publicProcedure, router } from "../../../lib/trpc/trpc";
import * as repository from "../repository/documentsRepository";

export const routerDocument = router({
    getValidDocumentsByRequestId: publicProcedure.input(z.object({ requestId: z.string().uuid() }))
        .query(async ({ input }) => {
            const { requestId } = input;
            console.log("Fetching valid documents for request ID:", requestId);
            return await repository.getValidDocumentsByRequestId(requestId);
        }),
    getValidDocumentsByRequestIds: publicProcedure.input(z.object({ requestIds: z.array(z.string().uuid()) }))
        .query(async ({ input }) => {
            const { requestIds } = input;
            console.log("Fetching valid documents for request IDs:", requestIds);
            return await repository.getValidDocumentsByRequestIds(requestIds);
        }),
})
