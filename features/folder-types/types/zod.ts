import { z } from 'zod';
import { documentTypeIdsSchema } from '../../document-types/types/zod';

export const CreateFolderTypeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  requiredDocuments: documentTypeIdsSchema,
  createdByOrganizationId: z.string().optional(),
});

export const UpdateFolderTypeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').optional(),
  description: z.string().optional(),
  requiredDocuments: documentTypeIdsSchema.optional(),
});
