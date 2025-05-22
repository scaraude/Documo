// app/api/folders/[id]/requests/route.ts
import { NextResponse } from 'next/server';
import * as folderRepository from '@/features/folders/repository/folderRepository';
import * as requestRepository from '@/features/requests/repository/requestRepository';

// GET /api/folders/[id]/requests - Get all requests in a folder
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const folder = await folderRepository.getFolderByIdWithRelations(params.id);

        if (!folder) {
            return NextResponse.json(
                { error: 'Folder not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(folder.requests || []);
    } catch (error) {
        console.error(`Error fetching requests for folder ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch folder requests' },
            { status: 500 }
        );
    }
}

// POST /api/folders/[id]/requests - Add a request to a folder
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { requestId } = body;

        if (!requestId) {
            return NextResponse.json(
                { error: 'Request ID is required' },
                { status: 400 }
            );
        }

        // Check if folder exists
        const folder = await folderRepository.getFolderById(params.id);
        if (!folder) {
            return NextResponse.json(
                { error: 'Folder not found' },
                { status: 404 }
            );
        }

        // Check if request exists
        const existingRequest = await requestRepository.getRequestById(requestId);
        if (!existingRequest) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }

        await folderRepository.addRequestToFolder(params.id, requestId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`Error adding request to folder ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to add request to folder' },
            { status: 500 }
        );
    }
}