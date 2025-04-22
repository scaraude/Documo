'use client'
import React, { useState } from 'react';
import { AVAILABLE_DOCUMENTS, useDocumentRequestTemplates } from '@/hooks';
import { AvailableDocument } from '../../hooks/useDocumentRequestTemplate/types';
import { DisplayTemplates } from '@/components';

const RequestTemplateCreator = () => {
    const [templateTitle, setTemplateTitle] = useState('');
    const [selectedDocuments, setSelectedDocuments] = useState<AvailableDocument[]>([]);
    const { templates, addTemplate, deleteTemplate } = useDocumentRequestTemplates();

    const resetForm = () => {
        setTemplateTitle('');
        setSelectedDocuments([]);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTemplate(templateTitle, selectedDocuments);

        resetForm();
    };

    const FormCreateTemplate = () => (
        <>
            <h1 className="text-2xl font-bold mb-6">Créer un modèle de demande</h1>

            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Titre du modèle
                    </label>
                    <input
                        type="text"
                        value={templateTitle}
                        onChange={(e) => setTemplateTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Ex: Dossier locatif"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Documents requis
                    </label>
                    <div className="space-y-2">
                        {Object.values(AVAILABLE_DOCUMENTS).map((doc) => (
                            <label key={doc} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedDocuments.includes(doc)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedDocuments([...selectedDocuments, doc]);
                                        } else {
                                            setSelectedDocuments(selectedDocuments.filter((d) => d !== doc));
                                        }
                                    }}
                                    className="mr-2"
                                />
                                {doc}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Enregistrer le modèle
                </button>
            </form>
        </>
    )
    return (
        <div className="max-w-2xl mx-auto p-6">
            <FormCreateTemplate />

            <DisplayTemplates templates={templates} deleteTemplate={deleteTemplate} />
        </div>
    );
};

export default RequestTemplateCreator;