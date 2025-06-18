import { z } from 'zod';
import { APP_DOCUMENT_TYPES } from '../../../shared/constants';

export const CreateFolderTypeSchema = z.object({
  name: z.string(),
  description: z.string(),
  requiredDocuments: z.nativeEnum(APP_DOCUMENT_TYPES).array(),
  createdById: z.string().optional(),
});

export const UpdateFolderTypeSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  requiredDocuments: z.nativeEnum(APP_DOCUMENT_TYPES).array().optional(),
});
