import { API_ROUTES } from "@/shared/constants";
import { AppDocument } from "@/shared/types";

/**
 * Get documents by request
 */
export async function getDocumentsByRequest(requestId: string): Promise<AppDocument[]> {
    const response = await fetch(API_ROUTES.DOCUMENTS.GET_BY_REQUEST(requestId));

    if (!response.ok) {
        console.log('Error fetching documents by request:', response.status, response.statusText);
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch documents by request');
    }

    return response.json();
}