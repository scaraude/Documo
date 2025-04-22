import { DocumentRequest } from '../types';

const PENDING_NOTIFICATION_KEY = 'pendingNotification';
const NOTIFICATION_RESPONSE_KEY = 'notificationResponse';

/**
 * Send a notification (currently simulated via localStorage)
 */
export async function sendNotification(request: DocumentRequest): Promise<void> {
    try {
        localStorage.setItem(PENDING_NOTIFICATION_KEY, JSON.stringify(request));
    } catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Failed to send notification');
    }
}

/**
 * Get pending notification
 */
export async function getPendingNotification(): Promise<DocumentRequest | null> {
    try {
        const notificationData = localStorage.getItem(PENDING_NOTIFICATION_KEY);
        if (!notificationData) return null;

        const parsedData = JSON.parse(notificationData);

        // Transform date strings to Date objects
        if (parsedData.createdAt) parsedData.createdAt = new Date(parsedData.createdAt);
        if (parsedData.expiresAt) parsedData.expiresAt = new Date(parsedData.expiresAt);
        if (parsedData.lastUpdatedAt) parsedData.lastUpdatedAt = new Date(parsedData.lastUpdatedAt);

        return parsedData;
    } catch (error) {
        console.error('Error getting notification:', error);
        throw new Error('Failed to get notification');
    }
}

/**
 * Clear pending notification
 */
export async function clearPendingNotification(): Promise<void> {
    try {
        localStorage.removeItem(PENDING_NOTIFICATION_KEY);
    } catch (error) {
        console.error('Error clearing notification:', error);
        throw new Error('Failed to clear notification');
    }
}

/**
 * Save notification response
 */
export async function saveNotificationResponse(
    requestId: string,
    response: 'accepted' | 'rejected'
): Promise<void> {
    try {
        const responseData = {
            requestId,
            response,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(NOTIFICATION_RESPONSE_KEY, JSON.stringify(responseData));
    } catch (error) {
        console.error('Error saving response:', error);
        throw new Error('Failed to save response');
    }
}

/**
 * Check for notification response
 */
export async function checkNotificationResponse(): Promise<{
    requestId: string;
    response: 'accepted' | 'rejected';
    timestamp: string;
} | null> {
    try {
        const responseData = localStorage.getItem(NOTIFICATION_RESPONSE_KEY);
        if (!responseData) return null;

        const response = JSON.parse(responseData);
        localStorage.removeItem(NOTIFICATION_RESPONSE_KEY);
        return response;
    } catch (error) {
        console.error('Error checking response:', error);
        throw new Error('Failed to check response');
    }
}