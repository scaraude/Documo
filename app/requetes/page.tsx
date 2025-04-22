'use client'
import React from 'react';
import { useDocumentRequestTemplates } from '@/hooks';
import { DisplayTemplates, FormCreateTemplate } from '@/components';

const RequestTemplateCreator = () => {

    const { templates, addTemplate, deleteTemplate } = useDocumentRequestTemplates();

    return (
        <div className="max-w-2xl mx-auto p-6">
            <FormCreateTemplate addTemplate={addTemplate} />

            <DisplayTemplates templates={templates} deleteTemplate={deleteTemplate} />
        </div>
    );
};

export default RequestTemplateCreator;