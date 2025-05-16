import { AppDocumentType } from "@/shared/constants/documents/types";

export interface RequestTemplate {
    id: string;
    title: string;
    requestedDocuments: AppDocumentType[];
    createdAt: Date;
}

export interface CreateRequestTemplateParams {
    title: string;
    requestedDocuments: AppDocumentType[];
}