import { AvailableDocument } from "../useDocumentRequestTemplate/types";

export interface DocumentRequest {
    id: string;
    civilId: string;
    requestedDocuments: AvailableDocument[];
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    createdAt: Date;
    expiresAt: Date;
    lastUpdatedAt: Date;
}