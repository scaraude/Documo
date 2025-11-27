import { z } from 'zod';
import {
  createDocumentTypeSchema,
  documentFileValidationSchema,
  documentTypeSchema,
  documentValidationResultSchema,
  updateDocumentTypeSchema,
} from './zod';

// API Response schemas
const getDocumentTypesResponseSchema = z.object({
  documentTypes: z.array(documentTypeSchema),
  total: z.number(),
});

const getDocumentTypeResponseSchema = z.object({
  documentType: documentTypeSchema.nullable(),
});

const createDocumentTypeResponseSchema = z.object({
  documentType: documentTypeSchema,
  message: z.string(),
});

const updateDocumentTypeResponseSchema = z.object({
  documentType: documentTypeSchema,
  message: z.string(),
});

const deleteDocumentTypeResponseSchema = z.object({
  message: z.string(),
});

const validateDocumentFileResponseSchema = documentValidationResultSchema;

// API Request schemas
const createDocumentTypeRequestSchema = createDocumentTypeSchema;
const updateDocumentTypeRequestSchema = updateDocumentTypeSchema;
const validateDocumentFileRequestSchema = documentFileValidationSchema;

// Type exports for API
type GetDocumentTypesResponse = z.infer<typeof getDocumentTypesResponseSchema>;
type GetDocumentTypeResponse = z.infer<typeof getDocumentTypeResponseSchema>;
type CreateDocumentTypeResponse = z.infer<
  typeof createDocumentTypeResponseSchema
>;
type UpdateDocumentTypeResponse = z.infer<
  typeof updateDocumentTypeResponseSchema
>;
type DeleteDocumentTypeResponse = z.infer<
  typeof deleteDocumentTypeResponseSchema
>;
type ValidateDocumentFileResponse = z.infer<
  typeof validateDocumentFileResponseSchema
>;

type CreateDocumentTypeRequest = z.infer<
  typeof createDocumentTypeRequestSchema
>;
type UpdateDocumentTypeRequest = z.infer<
  typeof updateDocumentTypeRequestSchema
>;
type ValidateDocumentFileRequest = z.infer<
  typeof validateDocumentFileRequestSchema
>;
