'use client'

import { trpc } from '../../../lib/trpc/client'

export const useExternalRequest = (token: string) => {

    const { data: request, isLoading, error } = trpc.external.getRequestByToken.useQuery({
        token
    })

    return {
        request,
        isLoading,
        error
    }
}
