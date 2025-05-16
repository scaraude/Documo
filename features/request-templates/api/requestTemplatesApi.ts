// features/request-templates/api/requestTemplatesApi.ts
import { DocumentType } from '@/shared/constants';
import { CreateRequestTemplateParams, RequestTemplate } from '../types';
import * as repository from '../repository/requestTemplatesRepository';

/**
 * Get all templates
 */
export async function getTemplates(): Promise<RequestTemplate[]> {
    return repository.getTemplates();
}

/**
 * Create a new template
 */
export async function createTemplate(params: CreateRequestTemplateParams): Promise<RequestTemplate> {
    return repository.createTemplate(params);
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: string): Promise<void> {
    return repository.deleteTemplate(id);
}

/**
 * Update a template
 */
export async function updateTemplate(
    id: string,
    data: { title?: string; requestedDocuments?: DocumentType[] }
): Promise<RequestTemplate> {
    return repository.updateTemplate(id, data);
}

/**
 * Get a template by ID
 */
export async function getTemplateById(id: string): Promise<RequestTemplate | undefined> {
    const template = await repository.getTemplateById(id);
    return template || undefined;
}   