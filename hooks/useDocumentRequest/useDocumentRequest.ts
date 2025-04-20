'use client'
import { useState, useEffect } from 'react'
import { DocumentRequest } from './types'


const STORAGE_KEY = 'requests'
const DEFAULT_EXPIRATION_DAYS = 7

export function useDocumentRequest() {
    const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const loadDocumentRequest = () => {
            try {
                const storedDocumentRequest = localStorage.getItem(STORAGE_KEY)
                if (storedDocumentRequest) {
                    const parsedDocumentRequest = JSON.parse(storedDocumentRequest).map((req: any) => ({
                        ...req,
                        createdAt: new Date(req.createdAt),
                        expiresAt: new Date(req.expiresAt),
                        lastUpdatedAt: new Date(req.lastUpdatedAt)
                    }))
                    setDocumentRequests(parsedDocumentRequest)
                }
            } catch (error) {
                console.error('Error loading requests:', error)
            }
            setIsLoaded(true)
        }

        loadDocumentRequest()
    }, [])

    const createRequest = (civilId: string, requestedDocuments: string[], expirationDays: number = DEFAULT_EXPIRATION_DAYS): DocumentRequest => {
        const now = new Date()
        const newRequest: DocumentRequest = {
            id: `req_${now.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
            civilId,
            requestedDocuments,
            status: 'pending',
            createdAt: now,
            expiresAt: new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000),
            lastUpdatedAt: now
        }

        const updatedDocumentRequest = [...documentRequests, newRequest]
        setDocumentRequests(updatedDocumentRequest)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocumentRequest))

        return newRequest
    }

    const updateRequestStatus = (id: string, newStatus: DocumentRequest['status']) => {
        const updatedDocumentRequest = documentRequests.map(request => {
            if (request.id === id) {
                return {
                    ...request,
                    status: newStatus,
                    lastUpdatedAt: new Date()
                }
            }
            return request
        })

        setDocumentRequests(updatedDocumentRequest)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocumentRequest))
    }

    const getRequestById = (id: string): DocumentRequest | undefined => {
        return documentRequests.find(request => request.id === id)
    }

    const deleteRequest = (id: string) => {
        const filteredDocumentRequest = documentRequests.filter(request => request.id !== id)
        setDocumentRequests(filteredDocumentRequest)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDocumentRequest))
    }

    return {
        requests: documentRequests,
        isLoaded,
        createRequest,
        updateRequestStatus,
        getRequestById,
        deleteRequest
    }
}