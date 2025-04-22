export const DOCUMENT_REQUEST_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    COMPLETED: 'completed'
} as const;

export type DocumentRequestStatus = typeof DOCUMENT_REQUEST_STATUS[keyof typeof DOCUMENT_REQUEST_STATUS];