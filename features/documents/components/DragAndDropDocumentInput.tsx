import { DOCUMENT_TYPES } from '@/shared/constants/documents/types';
import { SecureDocumentUpload } from './SecureDocumentUpload';

interface DragAndDropDocumentInputProps {
    documentType: DOCUMENT_TYPES;
    requestId: string;
    onUploadComplete: (documentId: string) => void;
    onUploadError: (error: Error) => void;
}

export const DragAndDropDocumentInput = ({
    documentType,
    requestId,
    onUploadComplete,
    onUploadError,
}: DragAndDropDocumentInputProps) => {
    const documentSections = [
        { title: "Carte d'identité", type: DOCUMENT_TYPES.IDENTITY_CARD },
        { title: "Passeport", type: DOCUMENT_TYPES.PASSPORT },
        { title: "RIB: Relevé d'identité bancaire", type: DOCUMENT_TYPES.BANK_STATEMENT },
        { title: "Justificatif de domicile", type: DOCUMENT_TYPES.UTILITY_BILL },
        { title: "Permis de conduire", type: DOCUMENT_TYPES.DRIVERS_LICENSE },
    ];

    const sectionToDisplay = documentSections.find(section => section.type === documentType);

    if (!sectionToDisplay) {
        return null;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-lg font-semibold mb-4">{sectionToDisplay.title}</h2>
            <SecureDocumentUpload
                requestId={requestId}
                documentType={sectionToDisplay.type}
                onUploadComplete={onUploadComplete}
                onUploadError={onUploadError}
            />
        </div>
    );
};
