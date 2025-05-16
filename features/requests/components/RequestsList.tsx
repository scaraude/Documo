'use client'
import { useEffect } from 'react';
import { DocumentRequestStatus, DOCUMENT_REQUEST_STATUS } from '@/shared/constants';
import { useRequest } from '../hooks/useRequest';
import { checkNotificationResponse } from '@/features/notifications/api/notificationsApi';
import { DocumentRequest } from '@/shared/types';

export const RequestsList = () => {
    const { requests, isLoaded, deleteRequest, updateRequestStatus } = useRequest();

    useEffect(() => {
        const checkForResponses = async () => {
            const response = await checkNotificationResponse()
            if (response) {
                console.log('Notification response received:', response)
                updateRequestStatus(response.requestId, response.response === 'accepted' ? 'accepted' : 'rejected')
            }
        }

        // Check immediately on load
        checkForResponses()

        // Also set up an interval to check periodically
        const intervalId = setInterval(checkForResponses, 2000)

        // Clean up the interval on unmount
        return () => clearInterval(intervalId)
    }, [updateRequestStatus])


    const handleDelete = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
            deleteRequest(id)
        }
    }

    const getStatusBadgeClasses = (status: DocumentRequestStatus) => {
        switch (status) {
            case DOCUMENT_REQUEST_STATUS.ACCEPTED:
                return 'bg-green-100 text-green-800'
            case DOCUMENT_REQUEST_STATUS.REJECTED:
                return 'bg-red-100 text-red-800'
            case DOCUMENT_REQUEST_STATUS.COMPLETED:
                return 'bg-blue-100 text-blue-800'
            case DOCUMENT_REQUEST_STATUS.PENDING:
            default:
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    const getStatusText = (status: DocumentRequestStatus) => {
        switch (status) {
            case DOCUMENT_REQUEST_STATUS.PENDING: return 'En attente';
            case DOCUMENT_REQUEST_STATUS.ACCEPTED: return 'Accepté';
            case DOCUMENT_REQUEST_STATUS.REJECTED: return 'Refusé';
            case DOCUMENT_REQUEST_STATUS.COMPLETED: return 'Complété';
            default: return status;
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!isLoaded) {
        return <div className="flex-1 p-6 py-20">Chargement...</div>
    }

    // Card view for mobile
    const RequestCard = ({ request }: { request: DocumentRequest }) => (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">ID: {request.civilId}</h3>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(request.status)}`}>
                    {getStatusText(request.status)}
                </span>
            </div>
            <div className="mb-2">
                <h4 className="text-sm font-medium text-gray-500">Documents demandés:</h4>
                <ul className="list-disc list-inside">
                    {request.requestedDocuments.map((doc, index) => (
                        <li key={index} className="text-sm text-gray-600">{doc}</li>
                    ))}
                </ul>
            </div>
            <div className="text-xs text-gray-500 mb-2">
                <div>Créé le: {formatDate(request.createdAt)}</div>
                <div>Expire le: {formatDate(request.expiresAt)}</div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={() => handleDelete(request.id)}
                    className="text-red-700 hover:text-red-950 text-sm"
                >
                    Supprimer
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex-1 p-4 md:p-6 py-10 md:py-20">
            <h2 className="text-xl font-semibold mb-4">Demandes en cours</h2>

            {/* Mobile card view */}
            <div className="md:hidden">
                {requests.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        Aucune demande en cours
                    </div>
                ) : (
                    requests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                    ))
                )}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Documents Demandés
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Date de création
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Date de expiration
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    Aucune demande en cours
                                </td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{request.civilId}</td>
                                    <td className="px-6 py-4">
                                        <ul className="list-disc list-inside">
                                            {request.requestedDocuments.map((doc, index) => (
                                                <li key={index} className="text-sm text-gray-600">{doc}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(request.status)}`}>
                                            {getStatusText(request.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(request.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(request.expiresAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(request.id)}
                                            className="text-red-700 hover:text-red-950 mx-2"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}