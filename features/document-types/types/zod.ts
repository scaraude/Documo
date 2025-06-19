import { z } from 'zod';

// Base DocumentType schema
export const documentTypeSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Le libellé est requis'),
  description: z.string().nullable(),
  acceptedFormats: z
    .array(z.string())
    .min(1, 'Au moins un format doit être accepté'),
  maxSizeMB: z.number().int().positive('La taille maximale doit être positive'),
  createdAt: z.date(),
});

// Schema for creating a DocumentType
export const createDocumentTypeSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  label: z.string().min(1, 'Le libellé est requis'),
  description: z.string().nullable().optional(),
  acceptedFormats: z
    .array(z.string())
    .min(1, 'Au moins un format doit être accepté'),
  maxSizeMB: z
    .number()
    .int()
    .positive('La taille maximale doit être positive')
    .default(5),
});

// Schema for updating a DocumentType
export const updateDocumentTypeSchema = createDocumentTypeSchema
  .partial()
  .omit({ id: true });

// Schema for validating document type IDs
export const documentTypeIdSchema = z
  .string()
  .min(1, "L'ID du type de document est requis");

// Schema for arrays of document type IDs
export const documentTypeIdsSchema = z
  .array(documentTypeIdSchema)
  .min(1, 'Au moins un type de document est requis');

// Schema for file validation based on document type
export const documentFileValidationSchema = z.object({
  documentTypeId: documentTypeIdSchema,
  fileSize: z.number().positive('La taille du fichier doit être positive'),
  mimeType: z.string().min(1, 'Le type MIME est requis'),
});

// Schema for validation result
export const documentValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
});

// Type exports
export type AppDocumentType = z.infer<typeof documentTypeSchema>;
export type CreateDocumentType = z.infer<typeof createDocumentTypeSchema>;
export type UpdateDocumentType = z.infer<typeof updateDocumentTypeSchema>;
export type DocumentTypeId = z.infer<typeof documentTypeIdSchema>;
export type DocumentTypeIds = z.infer<typeof documentTypeIdsSchema>;
export type DocumentFileValidation = z.infer<
  typeof documentFileValidationSchema
>;
export type DocumentValidationResult = z.infer<
  typeof documentValidationResultSchema
>;
