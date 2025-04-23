export interface NotificationResponse {
    requestId: string;
    response: 'accepted' | 'rejected';
    timestamp: string;
}