/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentRequest } from '@/shared/types';
import * as storage from '@/features/storage/api';
import { NotificationResponse } from '../types';

const PENDING_NOTIFICATION_KEY = 'pendingNotification';
const NOTIFICATION_RESPONSE_KEY = 'notificationResponse';

/**
 * Send a notification (currently simulated via localStorage)
 */
export async function sendNotification(request: DocumentRequest): Promise<void> {
    try {
        storage.setItem(PENDING_NOTIFICATION_KEY, request);
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
        const notificationData = storage.getItem<any>(PENDING_NOTIFICATION_KEY);
        if (!notificationData) return null;

        // Transform date strings to Date objects
        return {
            ...notificationData,
            createdAt: new Date(notificationData.createdAt),
            expiresAt: new Date(notificationData.expiresAt),
            updatedAt: new Date(notificationData.lastUpdatedAt),
        };
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
        storage.removeItem(PENDING_NOTIFICATION_KEY);
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
        const responseData: NotificationResponse = {
            requestId,
            response,
            timestamp: new Date().toISOString()
        };
        storage.setItem(NOTIFICATION_RESPONSE_KEY, responseData);
    } catch (error) {
        console.error('Error saving response:', error);
        throw new Error('Failed to save response');
    }
}

/**
 * Check for notification response
 */
export async function checkNotificationResponse(): Promise<NotificationResponse | null> {
    try {
        const responseData = storage.getItem<NotificationResponse>(NOTIFICATION_RESPONSE_KEY);
        if (!responseData) return null;

        // Clear the response after reading it
        storage.removeItem(NOTIFICATION_RESPONSE_KEY);
        return responseData;
    } catch (error) {
        console.error('Error checking response:', error);
        throw new Error('Failed to check response');
    }
}