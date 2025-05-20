'use client'
import { useCallback, useMemo, useState } from 'react';
import { DocumentRequest } from '@/shared/types';
import * as notificationsApi from '@/features/notifications/api';
import { NotificationResponse } from '@/features/notifications/types';

export function useNotifications() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Send a notification request
     */
    const sendNotification = useCallback(async (request: DocumentRequest) => {
        try {
            setIsLoading(true);
            await notificationsApi.sendNotification(request);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to send notification'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get pending notification
     */
    const getPendingNotification = useCallback(async (): Promise<DocumentRequest | null> => {
        try {
            setIsLoading(true);
            return await notificationsApi.getPendingNotification();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch notification'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Save notification response
     */
    const saveNotificationResponse = useCallback(async (
        requestId: string,
        response: NotificationResponse['response']
    ) => {
        try {
            setIsLoading(true);
            await notificationsApi.saveNotificationResponse(requestId, response);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to save response'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Check for notification response
     */
    const checkNotificationResponse = useCallback(async (): Promise<NotificationResponse | null> => {
        try {
            setIsLoading(true);
            return await notificationsApi.checkNotificationResponse();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to check notification response'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Setup notification listener (checks for responses at intervals)
     */
    const setupNotificationListener = useCallback((
        callback: (response: NotificationResponse) => void,
        interval = 2000
    ) => {
        const checkForResponses = async () => {
            const response = await checkNotificationResponse();
            if (response) {
                callback(response);
            }
        };

        // Check immediately
        checkForResponses();

        // Set up interval
        const intervalId = setInterval(checkForResponses, interval);

        // Return cleanup function
        return () => clearInterval(intervalId);
    }, [checkNotificationResponse]);

    return useMemo(() => ({
        isLoading,
        error,
        sendNotification,
        getPendingNotification,
        saveNotificationResponse,
        checkNotificationResponse,
        setupNotificationListener
    }),
        [isLoading,
            error,
            sendNotification,
            getPendingNotification,
            saveNotificationResponse,
            checkNotificationResponse,
            setupNotificationListener]);
};      