import { DocumentType } from "@/shared/constants/documents/types";

export interface RequestTemplate {
    id: string;
    title: string;
    requestedDocuments: DocumentType[];
    createdAt: string;
}

export interface CreateRequestTemplateParams {
    title: string;
    requestedDocuments: DocumentType[];
}