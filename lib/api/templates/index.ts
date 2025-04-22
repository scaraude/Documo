import * as storage from '../storage';
import { DocumentRequestTemplate, CreateTemplateParams } from '../types';
import { AvailableDocument } from '@/hooks/useDocumentRequestTemplate/types';

const STORAGE_KEY = 'document-request-templates';

/**
 * Get all templates
 */
export async function getTemplates(): Promise<DocumentRequestTemplate[]> {
    try {
        const templates = storage.getItem<DocumentRequestTemplate[]>(STORAGE_KEY);
        return templates || [];
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw new Error('Failed to fetch templates');
    }
}

/**
 * Create a new template
 */
export async function createTemplate(params: CreateTemplateParams): Promise<DocumentRequestTemplate> {
    try {
        const { title, requestedDocuments } = params;

        const newTemplate: DocumentRequestTemplate = {
            id: crypto.randomUUID(),
            title,
            requestedDocuments,
            createdAt: new Date().toISOString(),
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
    data: { title?: string; requestedDocuments?: AvailableDocument[] }
): Promise<DocumentRequestTemplate> {
    try {
        const templates = await getTemplates();
        let updatedTemplate: DocumentRequestTemplate | undefined;

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
export async function getTemplateById(id: string): Promise<DocumentRequestTemplate | undefined> {
    try {
        const templates = await getTemplates();
        return templates.find(template => template.id === id);
    } catch (error) {
        console.error('Error fetching template:', error);
        throw new Error('Failed to fetch template');
    }
}