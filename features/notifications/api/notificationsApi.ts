// features/notifications/api/notificationsApi.ts
import { DocumentRequest } from '@/shared/types';
import { NotificationResponse } from '../types';
import { API_ROUTES } from '../../../shared/constants';

/**
 * Send a notification
 */
export async function sendNotification(request: DocumentRequest): Promise<void> {
    const response = await fetch(API_ROUTES.NOTIFICATIONS.SEND, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send notification');
    }
}

/**
 * Get pending notification
 */
export async function getPendingNotification(): Promise<DocumentRequest | null> {
    const response = await fetch(API_ROUTES.NOTIFICATIONS.GET_PENDING);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch pending notification');
    }

    return response.json();
}

/**
 * Save notification response
 */
export async function saveNotificationResponse(
    requestId: string,
    responseType: NotificationResponse['response']
): Promise<void> {
    const response = await fetch(API_ROUTES.NOTIFICATIONS.SAVE_RESPONSE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, response: responseType }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save notification response');
    }
}

/**
 * Check for notification response
 */
export async function checkNotificationResponse(): Promise<NotificationResponse | null> {
    const response = await fetch(API_ROUTES.NOTIFICATIONS.CHECK_RESPONSE);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check notification response');
    }

    return response.json();
}
