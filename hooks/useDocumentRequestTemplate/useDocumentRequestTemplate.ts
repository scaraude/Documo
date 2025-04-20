'use client'
import { useState, useEffect } from 'react';
import { AVAILABLE_DOCUMENTS, AvailableDocument, DocumentRequestTemplate } from './types';

const STORAGE_KEY = 'document-request-templates';

export const useDocumentRequestTemplates = () => {
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

    const addTemplate = (title: string, requestedDocuments: AvailableDocument[]) => {
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

    const updateTemplate = (id: string, title: string, requestedDocuments: AvailableDocument[]) => {
        setTemplates(
            templates.map(template =>
                template.id === id
                    ? { ...template, title, requestedDocuments }
                    : template
            )
        );
    };

    return {
        isLoaded,
        templates,
        addTemplate,
        deleteTemplate,
        updateTemplate,
    };
};