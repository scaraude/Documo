'use client'
import { AVAILABLE_DOCUMENTS, useDocumentRequestTemplates } from '@/hooks'
import { FormNewRequest } from '@/components'

export default function NewRequest() {
    const { isLoaded, addTemplate, hasTemplates } = useDocumentRequestTemplates()

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        )
    } else {
        if (!hasTemplates) {
            addTemplate('Vérification bancaire', [AVAILABLE_DOCUMENTS.IDENTITY_CARD, AVAILABLE_DOCUMENTS.BANK_DETAILS])
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <FormNewRequest />
        </div>
    )
}