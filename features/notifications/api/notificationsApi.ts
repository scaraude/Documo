// features/notifications/api/notificationsApi.ts
import { DocumentRequest } from '@/shared/types';
import { NotificationResponse } from '../types';

/**
 * Send a notification
 */
export async function sendNotification(request: DocumentRequest): Promise<void> {
    const response = await fetch('/api/notifications', {
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
    const response = await fetch('/api/notifications/pending');

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
    const response = await fetch('/api/notifications/response', {
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
    const response = await fetch('/api/notifications/response');

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check notification response');
    }

    return response.json();
}
