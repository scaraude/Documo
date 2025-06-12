import { AppDocumentType } from "@/shared/constants";

export interface CreateRequestParams {
    email: string;
    requestedDocuments: AppDocumentType[];
    expirationDays?: number;
    folderId: string; // Add folder ID
}