export const DOCUMENT_TYPES = {
    IDENTITY_CARD: "Carte d'identité",
    PROOF_OF_ADDRESS: "Justificatif de domicile",
    SOCIAL_SECURITY_CERTIFICATE: "Attestation de sécurité sociale",
    TAX_NOTICE: "Avis d'imposition",
    BANK_DETAILS: "RIB"
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];