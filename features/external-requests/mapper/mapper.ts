import { z } from "zod"
import { Prisma } from "../../../lib/prisma"
import { prismaDocumentTypeToAppDocumentType } from "../../../shared/mapper/prismaMapper"
import { externalRequestSchema } from "../types/zod"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const shareLinkWithRequest = Prisma.validator<Prisma.RequestShareLinkDefaultArgs>()({
    include: { request: true },
})

export const prismaShareLinkToExternalRequest = (shareLink: Prisma.RequestShareLinkGetPayload<typeof shareLinkWithRequest>): z.infer<typeof externalRequestSchema> => {
    const request = shareLink.request
    return {
        id: request.id,
        civilId: request.civilId,
        requestedDocuments: request.requestedDocuments.map(prismaDocumentTypeToAppDocumentType),
        createdAt: request.createdAt,
        expiresAt: request.expiresAt,
    }
}