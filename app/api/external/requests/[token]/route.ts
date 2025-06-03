import { NextResponse } from 'next/server'
import * as requestsRepo from '@/features/requests/repository/requestRepository'

// GET /api/external/requests/[id] - Get a request by ID for external users
export async function GET(
    _request: Request,
    { params }: { params: { token: string } }
) {
    try {
        const request = await requestsRepo.getRequestById(params.token)
        if (!request) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            )
        }

        // Only return necessary information for external users
        return NextResponse.json({
            id: request.id,
            civilId: request.civilId,
            requestedDocuments: request.requestedDocuments,
            createdAt: request.createdAt,
            expiresAt: request.expiresAt,
        })
    } catch (error) {
        console.error('Error fetching request:', error)
        return NextResponse.json(
            { error: 'Failed to fetch request' },
            { status: 500 }
        )
    }
}
