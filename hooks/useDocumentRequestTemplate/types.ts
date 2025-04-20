export const AVAILABLE_DOCUMENTS = {
    IDENTITY_CARD: 'Carte d\'identité',
    PROOF_OF_ADDRESS: 'Justificatif de domicile',
    SOCIAL_SECURITY_CERTIFICATE: 'Attestation de sécurité sociale',
    TAX_NOTICE: 'Avis d\'imposition',
    BANK_DETAILS: 'RIB'
} as const;

export type AvailableDocument = typeof AVAILABLE_DOCUMENTS[keyof typeof AVAILABLE_DOCUMENTS];

export interface DocumentRequestTemplate {
    id: string;
    title: string;
    requestedDocuments: AvailableDocument[];
    createdAt: string;
    organizationId?: string;  // For multi-tenant scenarios
}