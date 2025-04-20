'use client'
import { useState, useEffect } from 'react';
import { DocumentRequestTemplate } from './types';

const STORAGE_KEY = 'document-request-templates';

export const useRequestTemplates = () => {
    const [templates, setTemplates] = useState<DocumentRequestTemplate[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setTemplates(JSON.parse(stored));
            }
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        }
    }, [templates, isLoaded]);

    const addTemplate = (title: string, requestedDocuments: string[]) => {
        const newTemplate: DocumentRequestTemplate = {
            id: crypto.randomUUID(),
            title,
            requestedDocuments,
            createdAt: new Date().toISOString(),
        };
        setTemplates([...templates, newTemplate]);
    };

    const deleteTemplate = (id: string) => {
        setTemplates(templates.filter(template => template.id !== id));
    };

    const updateTemplate = (id: string, title: string, requestedDocuments: string[]) => {
        setTemplates(
            templates.map(template =>
                template.id === id
                    ? { ...template, title, requestedDocuments }
                    : template
            )
        );
    };

    return {
        templates,
        addTemplate,
        deleteTemplate,
        updateTemplate,
    };
};