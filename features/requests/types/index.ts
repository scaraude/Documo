import { RequestStatus, DocumentType } from "@/shared/constants";

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