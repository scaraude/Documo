// /lib/api/types.ts
import { RequestStatus, DocumentType } from '@/constants';

// Request Types
export interface DocumentRequest {
    id: string;
    civilId: string;
    requestedDocuments: DocumentType[];
    status: RequestStatus;
    createdAt: Date;
    expiresAt: Date;
    lastUpdatedAt: Date;
}

export interface CreateRequestParams {
    civilId: string;
    requestedDocuments: DocumentType[];
    expirationDays?: number;
}

// Template Types
export interface DocumentRequestTemplate {
    id: string;
    title: string;
    requestedDocuments: DocumentType[];
    createdAt: string;
    organizationId?: string;
}

export interface CreateTemplateParams {
    title: string;
    requestedDocuments: DocumentType[];
}

// Notification Types
export interface NotificationResponse {
    requestId: string;
    response: 'accepted' | 'rejected';
    timestamp: string;
}