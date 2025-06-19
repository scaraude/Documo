// Document Type IDs that match the seeded DocumentType records
export const APP_DOCUMENT_TYPES = {
  IDENTITY_PROOF: 'IDENTITY_PROOF',
  DRIVERS_LICENSE: 'DRIVERS_LICENSE',
  BANK_STATEMENT: 'BANK_STATEMENT',
  RESIDENCY_PROOF: 'RESIDENCY_PROOF',
  TAX_RETURN: 'TAX_RETURN',
  EMPLOYMENT_CONTRACT: 'EMPLOYMENT_CONTRACT',
  SALARY_SLIP: 'SALARY_SLIP',
  BIRTH_CERTIFICATE: 'BIRTH_CERTIFICATE',
  MARRIAGE_CERTIFICATE: 'MARRIAGE_CERTIFICATE',
  DIPLOMA: 'DIPLOMA',
  MEDICAL_CERTIFICATE: 'MEDICAL_CERTIFICATE',
  LEASE_AGREEMENT: 'LEASE_AGREEMENT',
  INSURANCE_CERTIFICATE: 'INSURANCE_CERTIFICATE',
  OTHER: 'OTHER',
} as const;

export type AppDocumentType =
  (typeof APP_DOCUMENT_TYPES)[keyof typeof APP_DOCUMENT_TYPES];

export const ALLOWED_FILE_TYPES = {
  PDF: 'application/pdf',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validation will now be handled by the DocumentType repository
// which will fetch rules from the database
