// app/api/folders/[folderId]/requests/[requestId]/route.ts
import { NextResponse } from 'next/server';
import * as folderRepository from '@/features/folders/repository/foldersRepository';
import * as requestRepository from '@/features/requests/repository/requestRepository';

// DELETE /api/folders/[folderId]/requests/[requestId] - Remove a request from a folder
export async function DELETE(
    request: Request,
    { params }: { params: { folderId: string; requestId: string } }
) {
    try {
        // Check if folder exists
        const folder = await folderRepository.getFolderById(params.folderId);
        if (!folder) {
            return NextResponse.json(
                { error: 'Folder not found' },
                { status: 404 }
            );
        }

        // Check if request exists and belongs to the folder
        const existingRequest = await requestRepository.getRequestById(params.requestId);
        if (!existingRequest) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }

        if (existingRequest.folderId !== params.folderId) {
            return NextResponse.json(
                { error: 'Request does not belong to this folder' },
                { status: 400 }
            );
        }

        await folderRepository.removeRequestFromFolder(params.requestId);

        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        console.error(`Error removing request ${params.requestId} from folder ${params.folderId}:`, error);
        return NextResponse.json(
            { error: 'Failed to remove request from folder' },
            { status: 500 }
        );
    }
}