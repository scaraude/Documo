// features/requests/components/FormCreateRequest.tsx
// Update the existing file to include folder selection
'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ROUTES } from "@/shared/constants"
import { useRequest } from "../hooks/useRequest"
import { useFolder } from "@/features/folders/hooks/useFolder"
import { IDInput } from "@/shared/components/"
import { sendNotification } from "../../notifications/api/notificationsApi"
import { FolderSelector } from "@/features/folders/components/FolderSelector"

export const FormCreateRequest = () => {
    const [id, setId] = useState('')
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
    const [showSimulation, setShowSimulation] = useState(true)
    const router = useRouter()
    const searchParams = useSearchParams();
    const { folders, isLoaded: foldersLoaded } = useFolder()
    const { createRequest } = useRequest()
    const folderId = searchParams && searchParams.get("folderId");

    useEffect(() => {
        if (folderId) {
            setSelectedFolderId(folderId)
        }
    }, [folderId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFolderId) return

        const selectedFolder = folders.find(f => f.id === selectedFolderId)
        if (!selectedFolder) return

        const newRequest = await createRequest(
            id,
            selectedFolder.requestedDocuments,
            selectedFolderId,
            undefined,
        )

        console.log('New request created:', newRequest)

        if (showSimulation) {
            sendNotification(newRequest)
            window.open(ROUTES.NOTIFICATIONS.HOME, '_blank');
        }

        router.push(ROUTES.HOME)
    }

    return (
        <div className="max-w-md w-full space-y-8 mt-20 bg-gray-100 white p-8 rounded-lg shadow-lg">
            <div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Nouvelle Demande
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {/* Folder Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionnez un dossier
                    </label>
                    <div className="space-y-2">
                        {!foldersLoaded ? (
                            <p className="text-sm text-gray-500">Chargement des dossiers...</p>
                        ) : folders.length === 0 ? (
                            <Link href={ROUTES.FOLDERS.NEW}>
                                <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                    Créer un dossier
                                </button>
                            </Link>
                        ) : (
                            <FolderSelector
                                folders={folders}
                                selectedFolderId={selectedFolderId}
                                setSelectedFolderId={setSelectedFolderId}
                            />
                        )}
                    </div>
                </div>

                {selectedFolderId &&
                    <IDInput id={id} setId={setId} />}

                {selectedFolderId && (
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
                        disabled={!selectedFolderId || !id}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md
                                ${selectedFolderId && id
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