import { z } from 'zod'
import * as externalRequestsRepository from '@/features/external-requests/repository/externalRequestsRepository'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../../../lib/trpc/trpc'
import { APP_DOCUMENT_TYPES } from '@/shared/constants'
import { Prisma } from '@/lib/prisma';
import { prismaDocumentTypeToAppDocumentType } from '../../../shared/mapper/prismaMapper'

// Schema for external request response
const externalRequestSchema = z.object({
    id: z.string(),
    civilId: z.string(),
    requestedDocuments: z.nativeEnum(APP_DOCUMENT_TYPES).array(),
    createdAt: z.date(),
    expiresAt: z.date(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const shareLinkWithRequest = Prisma.validator<Prisma.RequestShareLinkDefaultArgs>()({
    include: { request: true },
})


const prismaSchemaToAppSchema = (shareLink: Prisma.RequestShareLinkGetPayload<typeof shareLinkWithRequest>): z.infer<typeof externalRequestSchema> => {
    const request = shareLink.request
    return {
        id: request.id,
        civilId: request.civilId,
        requestedDocuments: request.requestedDocuments.map(prismaDocumentTypeToAppDocumentType),
        createdAt: request.createdAt,
        expiresAt: request.expiresAt,
    }
}

export const externalRouter = router({
    getRequestByToken: publicProcedure
        .input(z.object({
            token: z.string().min(1, 'Token is required')
        }))
        .output(externalRequestSchema)
        .query(async ({ input }) => {
            try {
                const { token } = input

                const shareLink = await externalRequestsRepository.getShareLinkByToken(token)
                const request = shareLink?.request

                if (!request) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Request not found'
                    })
                }

                // Only return necessary information for external users
                return prismaSchemaToAppSchema(shareLink)
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error
                }

                console.error('Error fetching request:', error)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch request'
                })
            }
        }),
})

export type ExternalRouter = typeof externalRouter