'use client'

import { useState, useEffect } from 'react'
import { DocumentRequest } from '@/shared/types'
import { API_ROUTES } from '../../../shared/constants'

export const useExternalRequest = (token: string) => {
    const [request, setRequest] = useState<DocumentRequest | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await fetch(API_ROUTES.EXTERNAL.REQUEST(token))
                if (!response.ok) {
                    throw new Error('Request not found')
                }

                const data = await response.json()
                setRequest(data)
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch request'))
            } finally {
                setIsLoading(false)
            }
        }

        fetchRequest()
    }, [token])

    return {
        request,
        isLoading,
        error
    }
}
