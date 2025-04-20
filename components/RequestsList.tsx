'use client'

import { useDocumentRequest } from '@/hooks'
import type { DocumentRequest } from '../hooks/types';


export const RequestsList = () => {
    const { requests, isLoaded, deleteRequest } = useDocumentRequest();

    const handleDelete = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
            deleteRequest(id)
        }
    }

    const getStatusBadgeClasses = (status: DocumentRequest['status']) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            case 'completed':
                return 'bg-blue-100 text-blue-800'
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800'
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

    return (
        <div className="flex-1 p-6 py-20">
            <h2 className="text-xl font-semibold mb-4">Demandes en cours</h2>
            <div className="overflow-x-auto">
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
                                            {request.status === 'pending' ? 'En attente' :
                                                request.status === 'accepted' ? 'Accepté' :
                                                    request.status === 'rejected' ? 'Refusé' :
                                                        'Complété'}
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