import type { DocumentType, RequestStatus } from "@/constants";

export interface DocumentRequest {
    id: string;
    civilId: string;
    requestedDocuments: DocumentType[];
    status: RequestStatus;
    createdAt: Date;
    expiresAt: Date;
    lastUpdatedAt: Date;
}