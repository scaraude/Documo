export interface DocumentRequestTemplate {
    id: string;
    title: string;
    requestedDocuments: string[];
    createdAt: string;
    organizationId?: string;  // For multi-tenant scenarios
}