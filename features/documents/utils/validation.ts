import { DocumentValidationResult, DOCUMENT_VALIDATION_RULES, ALLOWED_FILE_TYPES, DOCUMENT_TYPES } from '@/shared/constants/documents/types';
import { Document } from '../types';
import { generateFileHash } from './encryption';

export async function validateDocument(document: Document, file: File): Promise<DocumentValidationResult> {
    const errors: string[] = [];
    const rules = DOCUMENT_VALIDATION_RULES[document.type];

    // Check file type
    if (!rules.allowedTypes.includes(file.type as typeof ALLOWED_FILE_TYPES[keyof typeof ALLOWED_FILE_TYPES])) {
        errors.push(`Invalid file type. Allowed types: ${rules.allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > rules.maxSize) {
        errors.push(`File too large. Maximum size: ${rules.maxSize / 1024 / 1024}MB`);
    }

    // Generate and verify file hash
    const hash = await generateFileHash(file);
    if (document.metadata.hash && document.metadata.hash !== hash) {
        errors.push('File integrity check failed');
    }

    // Additional validation based on document type
    switch (document.type) {
        case DOCUMENT_TYPES.IDENTITY_CARD:
        case DOCUMENT_TYPES.PASSPORT:
        case DOCUMENT_TYPES.DRIVERS_LICENSE:
            // Add specific validation for ID documents
            if (file.type.startsWith('image/')) {
                // TODO: Add image quality and content validation
            }
            break;
        case DOCUMENT_TYPES.UTILITY_BILL:
        case DOCUMENT_TYPES.BANK_STATEMENT:
            // Add specific validation for bills and statements
            if (file.type === 'application/pdf') {
                // TODO: Add PDF content validation
            }
            break;
    }

    return {
        isValid: errors.length === 0,
        errors
    };
} 