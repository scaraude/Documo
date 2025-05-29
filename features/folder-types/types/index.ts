import { AppDocumentType } from '@/shared/constants';

export interface CustomField {
    id: string;
    name: string;
    type: 'text' | 'number' | 'date' | 'email' | 'tel' | 'url';
    required: boolean;
    placeholder?: string;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        minLength?: number;
        maxLength?: number;
    };
}

export interface FolderType {
    id: string;
    name: string;
    description: string;
    requiredDocuments: AppDocumentType[];
    customFields: CustomField[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    createdById?: string;
}

export interface CreateFolderTypeParams {
    name: string;
    description: string;
    requiredDocuments: AppDocumentType[];
    customFields: CustomField[];
    createdById?: string;
}

export interface UpdateFolderTypeParams {
    name?: string;
    description?: string;
    requiredDocuments?: AppDocumentType[];
    customFields?: CustomField[];
}