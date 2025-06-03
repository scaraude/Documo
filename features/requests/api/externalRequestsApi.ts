// features/requests/api/externalRequestsApi.ts

import { API_ROUTES } from '@/shared/constants';
import { ShareLinkResponse } from '../../external-requests';

/**
 * Generate a share link for external access
 */
export async function generateShareLink(requestId: string): Promise<ShareLinkResponse> {
    const response = await fetch(API_ROUTES.EXTERNAL.SHARE_LINK(requestId), {
        method: 'POST',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate share link');
    }

    return response.json();
}
