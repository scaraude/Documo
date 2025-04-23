'use client'
import { useState, useEffect } from 'react';
import * as templatesApi from '../api/requestTemplatesApi';
import { DocumentType } from '@/shared/constants';
import { RequestTemplate } from '../types';

export function useRequestTemplates() {
    const [templates, setTemplates] = useState<RequestTemplate[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Load all templates on component mount
    useEffect(() => {
        async function loadTemplates() {
            try {
                setIsLoading(true);
                const data = await templatesApi.getTemplates();
                setTemplates(data);
                setIsLoaded(true);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        }

        loadTemplates();
    }, []);

    // Add template wrapper
    const addTemplate = async (title: string, requestedDocuments: DocumentType[]) => {
        try {
            setIsLoading(true);
            const newTemplate = await templatesApi.createTemplate({
                title,
                requestedDocuments
            });

            setTemplates(prev => [...prev, newTemplate]);
            return newTemplate;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create template'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete template wrapper
    const deleteTemplate = async (id: string) => {
        try {
            setIsLoading(true);
            await templatesApi.deleteTemplate(id);
            setTemplates(prev => prev.filter(template => template.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete template'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update template wrapper
    const updateTemplate = async (
        id: string,
        title: string,
        requestedDocuments: DocumentType[]
    ) => {
        try {
            setIsLoading(true);
            const updatedTemplate = await templatesApi.updateTemplate(id, {
                title,
                requestedDocuments
            });

            setTemplates(prev =>
                prev.map(template => template.id === id ? updatedTemplate : template)
            );
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update template'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        templates,
        hasTemplates: templates.length > 0,
        isLoaded,
        isLoading,
        error,
        addTemplate,
        deleteTemplate,
        updateTemplate
    };
}