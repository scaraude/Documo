'use client'
import { useRequestTemplates } from '@/features/request-templates'
import { FormCreateRequest } from '@/features/requests/components'

export default function NewRequest() {
    const { isLoaded } = useRequestTemplates()

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
            <FormCreateRequest />
        </div>
    )
}