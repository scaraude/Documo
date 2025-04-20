export interface DocumentRequest {
    id: string;
    requestedDocuments: string[];
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    createdAt: Date;
    expiresAt: Date;
    lastUpdatedAt: Date;
}