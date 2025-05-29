export enum APP_DOCUMENT_TYPES {
    IDENTITY_CARD = 'IDENTITY_CARD',
    PASSPORT = 'PASSPORT',
    DRIVERS_LICENSE = 'DRIVERS_LICENSE',
    BANK_STATEMENT = 'BANK_STATEMENT',
    UTILITY_BILL = 'UTILITY_BILL',
    OTHER = 'OTHER'
}

export type AppDocumentType = APP_DOCUMENT_TYPES;

export const ALLOWED_FILE_TYPES = {
    PDF: 'application/pdf',
    JPEG: 'image/jpeg',
    PNG: 'image/png'
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface DocumentValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface DocumentValidationRules {
    allowedTypes: (typeof ALLOWED_FILE_TYPES)[keyof typeof ALLOWED_FILE_TYPES][];
    maxSize: number;
    requiredFields?: string[];
}

export const DOCUMENT_VALIDATION_RULES: Record<APP_DOCUMENT_TYPES, DocumentValidationRules> = {
    [APP_DOCUMENT_TYPES.IDENTITY_CARD]: {
        allowedTypes: [ALLOWED_FILE_TYPES.JPEG, ALLOWED_FILE_TYPES.PNG],
        maxSize: MAX_FILE_SIZE, // 5MB
        requiredFields: ['expiryDate', 'documentNumber']
    },
    [APP_DOCUMENT_TYPES.PASSPORT]: {
        allowedTypes: [ALLOWED_FILE_TYPES.JPEG, ALLOWED_FILE_TYPES.PNG],
        maxSize: MAX_FILE_SIZE,
        requiredFields: ['expiryDate', 'passportNumber']
    },
    [APP_DOCUMENT_TYPES.DRIVERS_LICENSE]: {
        allowedTypes: [ALLOWED_FILE_TYPES.JPEG, ALLOWED_FILE_TYPES.PNG],
        maxSize: MAX_FILE_SIZE,
        requiredFields: ['expiryDate', 'licenseNumber']
    },
    [APP_DOCUMENT_TYPES.UTILITY_BILL]: {
        allowedTypes: [ALLOWED_FILE_TYPES.PDF],
        maxSize: MAX_FILE_SIZE,
        requiredFields: ['issueDate', 'accountNumber']
    },
    [APP_DOCUMENT_TYPES.BANK_STATEMENT]: {
        allowedTypes: [ALLOWED_FILE_TYPES.PDF],
        maxSize: MAX_FILE_SIZE,
        requiredFields: ['issueDate', 'accountNumber']
    },
    [APP_DOCUMENT_TYPES.OTHER]: {
        allowedTypes: [ALLOWED_FILE_TYPES.PDF, ALLOWED_FILE_TYPES.JPEG, ALLOWED_FILE_TYPES.PNG],
        maxSize: MAX_FILE_SIZE
    }
};