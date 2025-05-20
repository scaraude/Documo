export interface NotificationResponse {
    requestId: string;
    response: 'ACCEPTED' | 'REJECTED';
    timestamp: string;
}