'use client'
import { useDocumentRequestTemplates } from '@/hooks'
import { FormNewRequest } from '@/components'

export default function NewRequest() {
    const { isLoaded } = useDocumentRequestTemplates()

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
            <FormNewRequest />
        </div>
    )
}