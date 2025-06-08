import { z } from "zod";
import { publicProcedure, router } from "../../../lib/trpc/trpc";
import * as repository from "../repository/documentsRepository";

export const routerDocument = router({
    getValidDocumentsByRequestId: publicProcedure.input(z.object({ requestId: z.string().uuid() }))
        .query(async ({ input }) => {
            const { requestId } = input;
            return await repository.getValidDocumentsByRequestId(requestId);
        }),
})
