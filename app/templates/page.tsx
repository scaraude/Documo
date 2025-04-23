'use client'
import React from 'react';
import { RequestTemplateForm, RequestTemplatesList, useRequestTemplates } from '@/features/request-templates';

const RequestTemplateCreator = () => {

    const { templates, addTemplate, deleteTemplate } = useRequestTemplates();

    return (
        <div className="max-w-2xl mx-auto p-6">
            <RequestTemplateForm addTemplate={addTemplate} />
            <RequestTemplatesList templates={templates} deleteTemplate={deleteTemplate} />
        </div>
    );
};

export default RequestTemplateCreator;