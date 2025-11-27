import type z from 'zod';
import type { createRequestSchema } from './zod';

export type CreateRequestParams = z.infer<typeof createRequestSchema>;
