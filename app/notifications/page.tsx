'use client'

import { useEffect, useState } from 'react'
import { DocumentRequest } from '@/shared/types'
import { useNotifications } from '@/shared/hooks/useNotifications'
import { useRouter } from 'next/navigation'
import { ROUTES } from '../../shared/constants'

export default function NotificationPage() {
    const router = useRouter();
    const [notification, setNotification] = useState<DocumentRequest | null>(null)
    const [showNotification, setShowNotification] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { getPendingNotification, saveNotificationResponse } = useNotifications();

    useEffect(() => {
        async function loadNotification() {
            try {
                setIsLoading(true)
                const pendingNotification = await getPendingNotification()

                if (pendingNotification) {
                    setNotification(pendingNotification)
                    setShowNotification(true)

                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load notification'))
                console.error('Error loading notification:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadNotification()
    }, [getPendingNotification])

    const handleAccept = async () => {
        if (notification) {
            try {
                await saveNotificationResponse(notification.id, 'ACCEPTED')
                setShowNotification(false)
                router.push(`${ROUTES.DOCUMENTS.UPLOAD}${notification.id}`)
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to accept request'))
                console.error('Error accepting request:', err)
            }
        }
    }

    const handleDeny = async () => {
        if (notification) {
            try {
                await saveNotificationResponse(notification.id, 'REJECTED')
                setShowNotification(false)
                window.close() // Close the notification tab
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to reject request'))
                console.error('Error rejecting request:', err)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Chargement...</h1>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-800">Erreur</h1>
                    <p className="text-gray-600 mt-2">{error.message}</p>
                </div>
            </div>
        )
    }

    if (!showNotification) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Aucune notification</h1>
                    <p className="text-gray-600 mt-2">Cette page affiche les demandes d&apos;accès aux documents.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full p-6 border-t-4 border-blue-500 animate-appear">
                <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-100 p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Demande d&apos;accès aux documents</h2>
                </div>

                <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-1">ID demandeur</div>
                    <div className="font-medium">{notification?.civilId}</div>
                </div>

                <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-1">Documents demandés</div>
                    <ul className="list-disc list-inside">
                        {notification?.requestedDocuments.map((doc, index) => (
                            <li key={index} className="text-gray-700">{doc}</li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-1">Date de la demande</div>
                    <div className="font-medium">
                        {notification && new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleAccept}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
                    >
                        Accepter
                    </button>
                    <button
                        onClick={handleDeny}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150"
                    >
                        Refuser
                    </button>
                </div>
            </div>
        </div>
    )
}