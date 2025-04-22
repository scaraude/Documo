// /lib/api/types.ts
import { AvailableDocument } from '@/hooks/useDocumentRequestTemplate/types';

// Request Types
export interface DocumentRequest {
    id: string;
    civilId: string;
    requestedDocuments: AvailableDocument[];
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    createdAt: Date;
    expiresAt: Date;
    lastUpdatedAt: Date;
}

export interface CreateRequestParams {
    civilId: string;
    requestedDocuments: AvailableDocument[];
    expirationDays?: number;
}

// Template Types
export interface DocumentRequestTemplate {
    id: string;
    title: string;
    requestedDocuments: AvailableDocument[];
    createdAt: string;
    organizationId?: string;
}

export interface CreateTemplateParams {
    title: string;
    requestedDocuments: AvailableDocument[];
}

// Notification Types
export interface NotificationResponse {
    requestId: string;
    response: 'accepted' | 'rejected';
    timestamp: string;
}