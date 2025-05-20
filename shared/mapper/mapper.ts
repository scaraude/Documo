import { APP_DOCUMENT_TYPES } from "../constants";

export const APP_DOCUMENT_TYPE_TO_LABEL_MAP: Record<APP_DOCUMENT_TYPES, string> = {
    [APP_DOCUMENT_TYPES.IDENTITY_CARD]: 'Carte d\'identité',
    [APP_DOCUMENT_TYPES.PASSPORT]: 'Passeport',
    [APP_DOCUMENT_TYPES.DRIVERS_LICENSE]: 'Permis de conduire',
    [APP_DOCUMENT_TYPES.BANK_STATEMENT]: 'RIB: Relevé d\'identité bancaire',
    [APP_DOCUMENT_TYPES.UTILITY_BILL]: 'Justificatif de domicile',
    [APP_DOCUMENT_TYPES.OTHER]: 'Autre'
};