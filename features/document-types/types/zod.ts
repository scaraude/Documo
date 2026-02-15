import { z } from 'zod';

// Schema for validating document type IDs
export const documentTypeIdSchema = z
  .string()
  .uuid('ID de type de document invalide');

// Base DocumentType schema
const documentTypeSchema = z.object({
  id: documentTypeIdSchema,
  label: z.string().min(1, 'Le libellé est requis'),
  description: z.string().nullable(),
  acceptedFormats: z
    .array(z.string())
    .min(1, 'Au moins un format doit être accepté'),
  maxSizeMB: z.number().int().positive('La taille maximale doit être positive'),
  createdAt: z.date(),
});

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

// Type exports
export type AppDocumentType = z.infer<typeof documentTypeSchema>;
export type DocumentTypeId = z.infer<typeof documentTypeIdSchema>;
