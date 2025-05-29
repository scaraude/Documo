import { z } from 'zod';

export const customFieldSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    type: z.enum(['text', 'number', 'date', 'email', 'tel', 'url']),
    required: z.boolean(),
    placeholder: z.string().optional(),
    validation: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
    }).optional(),
});

export const customFieldValueSchema = z.record(z.string(), z.any());