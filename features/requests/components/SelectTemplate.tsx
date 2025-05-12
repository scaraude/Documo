import { RequestTemplate } from "../../request-templates";

interface SelectTemplateProps {
    templates: RequestTemplate[];
    selectedTemplateId: string | null;
    setSelectedTemplateId: React.Dispatch<React.SetStateAction<string | null>>;
}
export const SelectTemplate = ({ templates, selectedTemplateId, setSelectedTemplateId }: SelectTemplateProps): React.ReactNode =>
(
    templates.map((template) => (
        <label
            key={template.id}
            className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
        >
            <input
                type="radio"
                name="template"
                value={template.id}
                checked={selectedTemplateId === template.id}
                onChange={() => setSelectedTemplateId(template.id)}
                className="mr-3"
            />
            <div>
                <span className="font-medium">{template.title}</span>
                <p className="text-sm text-gray-500">
                    {template.requestedDocuments.length} document(s)
                </p>
            </div>
        </label>
    ))
)