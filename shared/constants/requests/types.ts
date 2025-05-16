export const DOCUMENT_REQUEST_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    COMPLETED: 'COMPLETED'
} as const;

export type DocumentRequestStatus = typeof DOCUMENT_REQUEST_STATUS[keyof typeof DOCUMENT_REQUEST_STATUS];