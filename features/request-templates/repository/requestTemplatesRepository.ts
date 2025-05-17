import prisma, { Prisma } from '@/lib/prisma';
import { AppDocumentType } from '@/shared/constants';
import { RequestTemplate, CreateRequestTemplateParams } from '../types';

// Type mapper entre Prisma et App
type PrismaRequestTemplate = Prisma.RequestTemplateGetPayload<null>;

/**
 * Convertit un modèle Prisma en modèle d'application
 */
function toAppModel(prismaModel: PrismaRequestTemplate): RequestTemplate {
    return {
        id: prismaModel.id,
        title: prismaModel.title,
        requestedDocuments: prismaModel.requestedDocuments as AppDocumentType[],
        createdAt: prismaModel.createdAt
    };
}

/**
 * Get all templates
 */
export async function getTemplates(): Promise<RequestTemplate[]> {
    try {
        const templates = await prisma.requestTemplate.findMany();

        // Convertir le format Prisma au format application
        return templates.map(toAppModel);
    } catch (error) {
        console.error('Error fetching templates from database:', error);
        throw new Error('Failed to fetch templates');
    }
}

/**
 * Get a template by ID
 */
export async function getTemplateById(id: string): Promise<RequestTemplate | null> {
    try {
        const template = await prisma.requestTemplate.findUnique({
            where: { id }
        });

        return template ? toAppModel(template) : null;
    } catch (error) {
        console.error(`Error fetching template with ID ${id}:`, error);
        throw new Error('Failed to fetch template');
    }
}

/**
 * Create a new template
 */
export async function createTemplate(params: CreateRequestTemplateParams): Promise<RequestTemplate> {
    try {
        const { title, requestedDocuments } = params;

        const newTemplate = await prisma.requestTemplate.create({
            data: {
                title,
                requestedDocuments: requestedDocuments,
            }
        });

        return toAppModel(newTemplate);
    } catch (error) {
        console.error('Error creating template in database:', error);
        throw new Error('Failed to create template');
    }
}

/**
 * Update a template
 */
export async function updateTemplate(
    id: string,
    data: { title?: string; requestedDocuments?: AppDocumentType[] }
): Promise<RequestTemplate> {
    try {
        const updatedTemplate = await prisma.requestTemplate.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.requestedDocuments && { requestedDocuments: data.requestedDocuments }),
            }
        });

        return toAppModel(updatedTemplate);
    } catch (error) {
        console.error(`Error updating template with ID ${id}:`, error);
        throw new Error('Failed to update template');
    }
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: string): Promise<void> {
    try {
        await prisma.requestTemplate.delete({
            where: { id }
        });
    } catch (error) {
        console.error(`Error deleting template with ID ${id}:`, error);
        throw new Error('Failed to delete template');
    }
}