import { DocumentRequest } from "@/hooks/types";

/**
 * Send a notification to simulate receiving a document request on another device
 * This opens a new tab with a notification view
 */
export const sendNotification = (request: DocumentRequest): void => {
    // Store the request data in localStorage for cross-tab communication
    localStorage.setItem('pendingNotification', JSON.stringify(request));

    // Open a new tab with the notification page
    window.open('/notification', '_blank');
};

/**
 * Check if there is a notification response in localStorage
 * This is used to check if the user responded to a notification
 */
export const checkNotificationResponse = (): {
    requestId: string;
    response: 'accepted' | 'rejected';
    timestamp: string;
} | null => {
    const responseData = localStorage.getItem('notificationResponse');

    if (responseData) {
        try {
            const response = JSON.parse(responseData);
            // Clear the response from localStorage
            localStorage.removeItem('notificationResponse');
            return response;
        } catch (error) {
            console.error('Error parsing notification response:', error);
        }
    }

    return null;
};