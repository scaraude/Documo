import { z } from "zod";
import { APP_DOCUMENT_TYPES } from "../../../shared/constants";
import { AppDocumentSchema } from "../../../shared/types";

// Schema for external request response
export const externalRequestSchema = z.object({
    id: z.string(),
    email: z.string(),
    requestedDocuments: z.nativeEnum(APP_DOCUMENT_TYPES).array(),
    createdAt: z.date(),
    expiresAt: z.date(),
})

export const externalCreateDocumentSchema = z.object({
    encryptedFile: z.instanceof(Uint8Array<ArrayBufferLike>),
    token: z.string().min(1, 'Token is required'),
    document: AppDocumentSchema.omit({ requestId: true }),
    dek: z.string().base64().min(1, 'Data Encryption Key is required'),
})
