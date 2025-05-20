import { AppDocumentType } from '@/shared/constants';
import { CreateRequestTemplateParams, RequestTemplate } from '../types';

// GET - Récupérer tous les templates
export async function getTemplates(): Promise<RequestTemplate[]> {
    const response = await fetch('/api/templates');
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch templates');
    }
    return response.json();
}

// POST - Créer un nouveau template
export async function createTemplate(params: CreateRequestTemplateParams): Promise<RequestTemplate> {
    const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create template');
    }
    return response.json();
}

// DELETE - Supprimer un template
export async function deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete template');
    }
}

// PUT - Mettre à jour un template
export async function updateTemplate(
    id: string,
    data: { title?: string; requestedDocuments?: AppDocumentType[] }
): Promise<RequestTemplate> {
    const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update template');
    }
    return response.json();
}

// GET - Récupérer un template par ID
export async function getTemplateById(id: string): Promise<RequestTemplate | undefined> {
    const response = await fetch(`/api/templates/${id}`);

    if (response.status === 404) {
        return undefined;
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch template');
    }

    return response.json();
}