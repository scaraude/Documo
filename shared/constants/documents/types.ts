// Document Type IDs that match the seeded DocumentType records
export const APP_DOCUMENT_TYPES = {
  IDENTITY_PROOF: 'e30329a4-dc0d-46d1-91ef-007d6e4e1cf9',
  DRIVERS_LICENSE: 'f761a5d9-a30b-455e-ac05-04c13a089f6d',
  BANK_STATEMENT: '7a36f121-80d9-4408-9e55-3160b77b8326',
  RESIDENCY_PROOF: '0078acd6-835e-4432-a658-8b5b4845e742',
  TAX_RETURN: 'b53294df-4360-44a8-a518-43e8a65911fc',
  EMPLOYMENT_CONTRACT: 'b057e48f-2480-4235-841d-32ad928495fd',
  SALARY_SLIP: '068e9a50-6259-4802-94c1-945eefc4a67a',
  BIRTH_CERTIFICATE: '44e4f3ad-89aa-4120-a780-ff578b7ba691',
  MARRIAGE_CERTIFICATE: '45165177-f04b-47bc-a582-c46c8000bc6b',
  DIPLOMA: 'faeff0f5-e3d5-4463-b4c4-ba6088f4d8eb',
  MEDICAL_CERTIFICATE: '026464ee-1052-48fa-9b66-ec30f73907d8',
  LEASE_AGREEMENT: '6110c7de-e5ac-4624-a2da-c3f8750259b2',
  INSURANCE_CERTIFICATE: 'ccd92a08-7c58-476c-8081-5b8c72572a9c',
  OTHER: '3bd3e5b3-9c07-4479-b355-1d312a9529f7',
} as const;

export type AppDocumentType =
  (typeof APP_DOCUMENT_TYPES)[keyof typeof APP_DOCUMENT_TYPES];

const ALLOWED_FILE_TYPES = {
  PDF: 'application/pdf',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
} as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validation will now be handled by the DocumentType repository
// which will fetch rules from the database
