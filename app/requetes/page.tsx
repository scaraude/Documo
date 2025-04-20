'use client'
import React, { useState } from 'react';
import { useDocumentTemplates } from '@/hooks';

const AVAILABLE_DOCUMENTS = [
    'Carte d\'identité',
    'Justificatif de domicile',
    'Attestation de sécurité sociale',
    'Avis d\'imposition',
    'RIB'
];

const DocumentTemplateCreator = () => {
    const [templateTitle, setTemplateTitle] = useState('');
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const { templates, addTemplate, deleteTemplate } = useDocumentTemplates();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTemplate(templateTitle, selectedDocuments);
        // Reset form
        setTemplateTitle('');
        setSelectedDocuments([]);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
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
                        {AVAILABLE_DOCUMENTS.map((doc) => (
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

            <div>
                <h2 className="text-xl font-semibold mb-4">Modèles enregistrés</h2>
                {templates.length === 0 ? (
                    <p className="text-gray-500">Aucun modèle enregistré</p>
                ) : (
                    <ul className="space-y-4">
                        {templates.map((template) => (
                            <li key={template.id} className="border p-4 rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium">{template.title}</h3>
                                    <button
                                        onClick={() => deleteTemplate(template.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                    {template.requestedDocuments.map((doc) => (
                                        <li key={doc}>{doc}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DocumentTemplateCreator;