import { z } from 'zod';
import {
  createDocumentTypeSchema,
  documentFileValidationSchema,
  documentTypeSchema,
  documentValidationResultSchema,
  updateDocumentTypeSchema,
} from './zod';

// API Response schemas
export const getDocumentTypesResponseSchema = z.object({
  documentTypes: z.array(documentTypeSchema),
  total: z.number(),
});

export const getDocumentTypeResponseSchema = z.object({
  documentType: documentTypeSchema.nullable(),
});

export const createDocumentTypeResponseSchema = z.object({
  documentType: documentTypeSchema,
  message: z.string(),
});

export const updateDocumentTypeResponseSchema = z.object({
  documentType: documentTypeSchema,
  message: z.string(),
});

export const deleteDocumentTypeResponseSchema = z.object({
  message: z.string(),
});

export const validateDocumentFileResponseSchema =
  documentValidationResultSchema;

// API Request schemas
export const createDocumentTypeRequestSchema = createDocumentTypeSchema;
export const updateDocumentTypeRequestSchema = updateDocumentTypeSchema;
export const validateDocumentFileRequestSchema = documentFileValidationSchema;

// Type exports for API
export type GetDocumentTypesResponse = z.infer<
  typeof getDocumentTypesResponseSchema
>;
export type GetDocumentTypeResponse = z.infer<
  typeof getDocumentTypeResponseSchema
>;
export type CreateDocumentTypeResponse = z.infer<
  typeof createDocumentTypeResponseSchema
>;
export type UpdateDocumentTypeResponse = z.infer<
  typeof updateDocumentTypeResponseSchema
>;
export type DeleteDocumentTypeResponse = z.infer<
  typeof deleteDocumentTypeResponseSchema
>;
export type ValidateDocumentFileResponse = z.infer<
  typeof validateDocumentFileResponseSchema
>;

export type CreateDocumentTypeRequest = z.infer<
  typeof createDocumentTypeRequestSchema
>;
export type UpdateDocumentTypeRequest = z.infer<
  typeof updateDocumentTypeRequestSchema
>;
export type ValidateDocumentFileRequest = z.infer<
  typeof validateDocumentFileRequestSchema
>;
