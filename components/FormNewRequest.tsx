'use client'
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AVAILABLE_DOCUMENTS, useDocumentRequest, useDocumentRequestTemplates } from "@/hooks"
import { ButtonCreateNewModel } from "./ButtonCreateNewModel"
import { SelectTemplate } from "./SelectTemplate"
import { IDInput } from "./IDInput"
import Link from "next/link"
import { sendNotification } from '@/lib/api/notifications'

export const FormNewRequest = () => {
    const [id, setId] = useState('')
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
    const [showSimulation, setShowSimulation] = useState(true)
    const router = useRouter()
    const { templates, hasTemplates, addTemplate } = useDocumentRequestTemplates()
    const { createRequest } = useDocumentRequest()
    const hasRun = useRef(false);

    //[DEMO] use for semo purpose
    useEffect(() => {
        if (!hasTemplates && !hasRun.current) {
            hasRun.current = true;
            addTemplate('Vérification bancaire', [AVAILABLE_DOCUMENTS.IDENTITY_CARD, AVAILABLE_DOCUMENTS.BANK_DETAILS]);
        }
    }, [hasTemplates, addTemplate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedTemplateId) return

        const selectedTemplate = templates.find(t => t.id === selectedTemplateId)
        if (!selectedTemplate) return

        const newRequest = await createRequest(id, selectedTemplate.requestedDocuments)

        console.log('New request created:', newRequest)

        if (showSimulation) {
            // Send notification to simulate a new device receiving it
            sendNotification(newRequest)
            window.open('/notification', '_blank');
        }

        router.push('/')
    }

    return (
        <div className="max-w-md w-full space-y-8 mt-20 bg-gray-100 white p-8 rounded-lg shadow-lg">
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
                        {!hasTemplates ?
                            <ButtonCreateNewModel /> :
                            <SelectTemplate
                                templates={templates}
                                selectedTemplateId={selectedTemplateId}
                                setSelectedTemplateId={setSelectedTemplateId}
                            />
                        }
                    </div>
                </div>

                {selectedTemplateId &&
                    <IDInput id={id} setId={setId} />}

                {selectedTemplateId && (
                    <div className="flex items-center">
                        <input
                            id="simulate"
                            name="simulate"
                            type="checkbox"
                            checked={showSimulation}
                            onChange={(e) => setShowSimulation(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="simulate" className="ml-2 block text-sm text-gray-700">
                            Simuler la notification sur un autre appareil
                        </label>
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
    )
}