import { NextResponse } from 'next/server';
import { generateSecureToken } from '@/lib/utils';
import * as externalRequestsRepository from '@/features/external-requests';
import { ErrorResponse, ShareLinkParams, ShareLinkResponse } from '@/features/external-requests';

// POST /api/external/share-link/[id] - Generate a shareable link for a request
export async function POST(
    request: Request,
    { params }: ShareLinkParams
): Promise<NextResponse<ShareLinkResponse | ErrorResponse>> {
    try {
        const { id: requestId } = params;
        // Generate a secure token that will be used to identify this shared request
        const token = await generateSecureToken();

        console.log(`Generated token: ${token} for request ID: ${requestId}`);
        // Store the share token with expiration
        await externalRequestsRepository.createShareLink({
            requestId,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry by default
        });

        // Return the share token
        return NextResponse.json({ token });
    } catch (error) {
        console.error(`Error generating share link for request ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to generate share link' },
            { status: 500 }
        );
    }
}
