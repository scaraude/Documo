import { AppDocumentType } from "@/shared/constants";

export interface CreateRequestParams {
    civilId: string;
    requestedDocuments: AppDocumentType[];
    expirationDays?: number;
    folderId: string; // Add folder ID
}