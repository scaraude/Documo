import { z } from "zod";
import { APP_DOCUMENT_TYPES } from "../../../shared/constants";

export const CreateFolderSchema = z.object({
    name: z.string(),
    folderTypeId: z.string(),
    description: z.string().optional(),
    expiresAt: z.date().nullable(),
    requestedDocuments: z.nativeEnum(APP_DOCUMENT_TYPES).array(),
    createdById: z.string().uuid().optional(),
});
