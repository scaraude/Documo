import { DocumentType } from "@/shared/constants";

export interface CreateRequestParams {
    civilId: string;
    requestedDocuments: DocumentType[];
    expirationDays?: number;
}