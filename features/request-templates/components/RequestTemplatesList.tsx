import { ReactNode } from "react"
import { RequestTemplate } from "../types";
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from "@/shared/mapper";

interface RequestTemplatesListProps {
    templates: RequestTemplate[];
    deleteTemplate: (id: string) => void;
};

export const RequestTemplatesList = ({ templates, deleteTemplate }: RequestTemplatesListProps): ReactNode => {
    const hasModel = templates.length > 0;

    return <div>
        <h2 className="text-xl font-semibold mb-4">Modèles enregistrés</h2>
        {!hasModel ? (
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
                                <li key={doc}>{APP_DOCUMENT_TYPE_TO_LABEL_MAP[doc]}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        )}
    </div>
}