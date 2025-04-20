'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDocumentRequest, useDocumentRequestTemplates } from '@/hooks'

export default function NewRequest() {
    const [id, setId] = useState('')
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
    const router = useRouter()
    const { templates, isLoaded } = useDocumentRequestTemplates()
    const { createRequest } = useDocumentRequest()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedTemplateId) return

        const selectedTemplate = templates.find(t => t.id === selectedTemplateId)
        if (!selectedTemplate) return

        const newRequest = createRequest(selectedTemplate.requestedDocuments)

        console.log('New request created:', newRequest)
        router.push('/')
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Nouvelle Demande
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Template Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sélectionnez un modèle
                        </label>
                        <div className="space-y-2">
                            {templates.length === 0 ? (
                                <p className="text-sm text-gray-500">Aucun modèle disponible</p>
                            ) : (
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
                            )}
                        </div>
                    </div>

                    {/* ID Input - Only shown when a template is selected */}
                    {selectedTemplateId && (
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                                ID
                            </label>
                            <input
                                id="id"
                                name="id"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="Entrez l'ID"
                            />
                        </div>
                    )}

                    <div className="flex justify-between">
                        <Link href="/">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Retour
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={!selectedTemplateId || !id}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md
                                ${selectedTemplateId && id
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            Soumettre
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}