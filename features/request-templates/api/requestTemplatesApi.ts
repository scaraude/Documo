import * as storage from '@/features/storage/api';
import { DocumentType } from '@/shared/constants';
import { CreateRequestTemplateParams, RequestTemplate } from '../types';

const STORAGE_KEY = 'document-request-templates';

/**
 * Get all templates
 */
export async function getTemplates(): Promise<RequestTemplate[]> {
    try {
        const templates = storage.getItem<RequestTemplate[]>(STORAGE_KEY);
        return templates || [];
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw new Error('Failed to fetch templates');
    }
}

/**
 * Create a new template
 */
export async function createTemplate(params: CreateRequestTemplateParams): Promise<RequestTemplate> {
    try {
        const { title, requestedDocuments } = params;

        const newTemplate: RequestTemplate = {
            id: crypto.randomUUID(),
            title,
            requestedDocuments,
            createdAt: new Date(),
        };

        const templates = await getTemplates();
        const updatedTemplates = [...templates, newTemplate];

        storage.setItem(STORAGE_KEY, updatedTemplates);
        return newTemplate;
    } catch (error) {
        console.error('Error creating template:', error);
        throw new Error('Failed to create template');
    }
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: string): Promise<void> {
    try {
        const templates = await getTemplates();
        const filteredTemplates = templates.filter(template => template.id !== id);
        storage.setItem(STORAGE_KEY, filteredTemplates);
    } catch (error) {
        console.error('Error deleting template:', error);
        throw new Error('Failed to delete template');
    }
}

/**
 * Update a template
 */
export async function updateTemplate(
    id: string,
    data: { title?: string; requestedDocuments?: DocumentType[] }
): Promise<RequestTemplate> {
    try {
        const templates = await getTemplates();
        let updatedTemplate: RequestTemplate | undefined;

        const updatedTemplates = templates.map(template => {
            if (template.id === id) {
                updatedTemplate = {
                    ...template,
                    ...(data.title && { title: data.title }),
                    ...(data.requestedDocuments && { requestedDocuments: data.requestedDocuments }),
                };
                return updatedTemplate;
            }
            return template;
        });

        if (!updatedTemplate) {
            throw new Error(`Template with ID ${id} not found`);
        }

        storage.setItem(STORAGE_KEY, updatedTemplates);
        return updatedTemplate;
    } catch (error) {
        console.error('Error updating template:', error);
        throw new Error('Failed to update template');
    }
}

/**
 * Get a template by ID
 */
export async function getTemplateById(id: string): Promise<RequestTemplate | undefined> {
    try {
        const templates = await getTemplates();
        return templates.find(template => template.id === id);
    } catch (error) {
        console.error('Error fetching template:', error);
        throw new Error('Failed to fetch template');
    }
}