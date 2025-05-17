import * as repository from '../repository/notificationsRepository';
import { DocumentRequest } from '@/shared/types';
import { NotificationResponse } from '../types';

/**
 * Send a notification
 */
export async function sendNotification(request: DocumentRequest): Promise<void> {
    return repository.sendNotification(request);
}

/**
 * Get pending notification
 */
export async function getPendingNotification(): Promise<DocumentRequest | null> {
    return repository.getPendingNotification();
}

/**
 * Save notification response
 */
export async function saveNotificationResponse(
    requestId: string,
    response: 'accepted' | 'rejected'
): Promise<void> {
    return repository.saveNotificationResponse(requestId, response);
}

/**
 * Check for notification response
 */
export async function checkNotificationResponse(): Promise<NotificationResponse | null> {
    return repository.checkNotificationResponse();
}