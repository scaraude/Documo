import { NextResponse } from 'next/server';
import * as repository from '@/features/folder-types/repository/folderTypesRepository';
import { UpdateFolderTypeParams } from '@/features/folder-types/types';

// GET /api/folder-types/[id] - Get a folder type by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const folderType = await repository.getFolderTypeById(params.id);

        if (!folderType) {
            return NextResponse.json(
                { error: 'Folder type not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(folderType);
    } catch (error) {
        console.error(`Error fetching folder type with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch folder type' },
            { status: 500 }
        );
    }
}

// PUT /api/folder-types/[id] - Update a folder type
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        // Vérifier si le type est utilisé avant de modifier les documents requis
        if (body.requiredDocuments) {
            const isInUse = await repository.isFolderTypeInUse(params.id);
            if (isInUse) {
                return NextResponse.json(
                    { error: 'Cannot modify required documents for a folder type in use' },
                    { status: 400 }
                );
            }
        }

        const updatedFolderType = await repository.updateFolderType(
            params.id,
            body as UpdateFolderTypeParams
        );

        return NextResponse.json(updatedFolderType);
    } catch (error) {
        console.error(`Error updating folder type with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to update folder type' },
            { status: 500 }
        );
    }
}

// DELETE /api/folder-types/[id] - Soft delete a folder type
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Vérifier si le type est utilisé
        const isInUse = await repository.isFolderTypeInUse(params.id);
        if (isInUse) {
            return NextResponse.json(
                { error: 'Cannot delete a folder type that is in use' },
                { status: 400 }
            );
        }

        await repository.deleteFolderType(params.id);
        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        console.error(`Error deleting folder type with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to delete folder type' },
            { status: 500 }
        );
    }
}