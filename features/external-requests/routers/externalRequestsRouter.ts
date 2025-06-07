import { z } from 'zod'
import * as externalRequestsRepository from '@/features/external-requests/repository/externalRequestsRepository'
import * as documentRepository from '@/features/documents/repository/documentsRepository'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../../../lib/trpc/trpc'
import { externalCreateDocumentSchema, externalRequestSchema } from '../types/zod'
import { prismaShareLinkToExternalRequest } from '../mapper/mapper'


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
                return prismaShareLinkToExternalRequest(shareLink)
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

    createDocument: publicProcedure
        .input(externalCreateDocumentSchema)
        .mutation(async ({ input }) => {
            try {
                // Utiliser formData pour gérer les fichiers
                const file = input.encryptedFile
                const token = input.token.slice(1, -1)
                const documentData = input.document

                const shareLink = await externalRequestsRepository.getShareLinkByToken(token);

                if (!shareLink) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Request not found'
                    })
                }

                const requestId = shareLink.request.id;
                const folderId = shareLink.request.folderId || undefined;

                if (!file || !documentData) {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: 'File and document data are missing'
                    })
                }

                // Sauvegarder le document dans la base de données
                return await documentRepository.uploadDocument({ ...documentData, requestId, folderId });
            } catch (error) {
                console.error('Error uploading document:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to upload document'
                })
            }
        })
})


export type ExternalRouter = typeof externalRouter