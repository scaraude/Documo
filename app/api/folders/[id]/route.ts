// app/api/folders/[id]/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/folders/repository/folderRepository';
import { CreateFolderParams } from '@/features/folders/types';

// GET /api/folders/[id] - Get a folder by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const url = new URL(request.url);
    const includeRelations = url.searchParams.get('includeRelations') === 'true';

    try {
        const folder = includeRelations ? await repository.getFolderByIdWithRelations(params.id) : await repository.getFolderById(params.id)

        if (!folder) {
            return NextResponse.json(
                { error: 'Folder not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(folder);
    } catch (error) {
        console.error(`Error fetching folder with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch folder' },
            { status: 500 }
        );
    }
}

// PUT /api/folders/[id] - Update a folder
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const updatedFolder = await repository.updateFolder(
            params.id,
            body as CreateFolderParams
        );

        return NextResponse.json(updatedFolder);
    } catch (error) {
        console.error(`Error updating folder with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to update folder' },
            { status: 500 }
        );
    }
}

// DELETE /api/folders/[id] - Delete a folder
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await repository.deleteFolder(params.id);
        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        console.error(`Error deleting folder with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to delete folder' },
            { status: 500 }
        );
    }
}