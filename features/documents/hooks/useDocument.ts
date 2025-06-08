import { trpc } from "../../../lib/trpc/client"

export const useDocument = () => {
    const getDocumentsByRequestId = (requestId?: string) => trpc.documents.getValidDocumentsByRequestId.useQuery({
        requestId: requestId || '',
    }, { enabled: !!requestId } // Only run when requestId exists)
    );

    return {
        getDocumentsByRequestId,
    }
}