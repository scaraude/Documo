import { DocumentType } from "@/shared/constants/documents/types";

export interface RequestTemplate {
    id: string;
    title: string;
    requestedDocuments: DocumentType[];
    createdAt: Date;
}

export interface CreateRequestTemplateParams {
    title: string;
    requestedDocuments: DocumentType[];
}