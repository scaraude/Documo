import type { DocumentType, RequestStatus } from "@/constants";

export interface DocumentRequestTemplate {
    id: string;
    title: string;
    requestedDocuments: DocumentType[];
    createdAt: string;
    organizationId?: string;  // For multi-tenant scenarios
}

export interface DocumentRequest {
    id: string;
    civilId: string;
    requestedDocuments: DocumentType[];
    status: RequestStatus;
    createdAt: Date;
    expiresAt: Date;
    lastUpdatedAt: Date;
}