import { APP_DOCUMENT_TYPES, AppDocumentType } from "../constants";
import { DocumentType as PrismaDocumentType, } from '../../lib/prisma/generated/client'


export const prismaDocumentTypeToAppDocumentType = (prismaDocumentType: PrismaDocumentType): AppDocumentType => {
    switch (prismaDocumentType) {
        case 'IDENTITY_CARD':
            return APP_DOCUMENT_TYPES.IDENTITY_CARD;
        case 'PASSPORT':
            return APP_DOCUMENT_TYPES.PASSPORT;
        case 'DRIVERS_LICENSE':
            return APP_DOCUMENT_TYPES.DRIVERS_LICENSE;
        case 'BANK_STATEMENT':
            return APP_DOCUMENT_TYPES.BANK_STATEMENT;
        case 'UTILITY_BILL':
            return APP_DOCUMENT_TYPES.UTILITY_BILL;
        case 'OTHER':
            return APP_DOCUMENT_TYPES.OTHER;
        default:
            const never: never = prismaDocumentType;
            return never
    }

}