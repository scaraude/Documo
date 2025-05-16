'use client'
import { useState } from "react";
import { APP_DOCUMENT_TYPES, AppDocumentType } from "@/shared/constants";

interface RequestTemplateFormProps {
    addTemplate: (title: string, requestedDocuments: AppDocumentType[]) => void;
}

export const RequestTemplateForm = ({ addTemplate }: RequestTemplateFormProps) => {
    const [templateTitle, setTemplateTitle] = useState('');
    const [selectedDocuments, setSelectedDocuments] = useState<AppDocumentType[]>([]);

    const resetForm = () => {
        setTemplateTitle('');
        setSelectedDocuments([]);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTemplate(templateTitle, selectedDocuments);

        resetForm();
    };

    return (
        <div className="p-4 pb-0.5 mb-6 rounded-2xl bg-slate-200 md:shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Créer un modèle de demande</h1>

            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                <div>
                    <label htmlFor="template-title" className="block text-sm font-medium mb-2">
                        Titre du modèle
                    </label>
                    <input
                        id="template-title"
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
                        {Object.values(APP_DOCUMENT_TYPES).map((doc) => (
                            <label key={doc} className="flex items-center">
                                <input
                                    id={`document-${doc}`}
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
                                <span>{doc}</span>
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
        </div>
    )
}