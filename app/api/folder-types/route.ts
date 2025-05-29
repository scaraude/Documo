import { NextResponse } from 'next/server';
import * as repository from '@/features/folder-types/repository/folderTypesRepository';
import { CreateFolderTypeParams } from '@/features/folder-types/types';
import { customFieldSchema } from '@/shared/schemas/customField';
// import { z } from 'zod';

// GET /api/folder-types - Get all folder types
export async function GET(request: Request) {
    const url = new URL(request.url);
    const withStats = url.searchParams.get('withStats') === 'true';

    try {
        if (withStats) {
            const folderTypesWithStats = await repository.getFolderTypesWithStats();
            return NextResponse.json(folderTypesWithStats);
        } else {
            const folderTypes = await repository.getFolderTypes();
            return NextResponse.json(folderTypes);
        }
    } catch (error) {
        console.error('Error fetching folder types:', error);
        return NextResponse.json(
            { error: 'Failed to fetch folder types' },
            { status: 500 }
        );
    }
}

// POST /api/folder-types - Create a new folder type
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Valider les custom fields
        if (body.customFields) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                body.customFields.forEach((field: any) =>
                    customFieldSchema.parse(field)
                );
            } catch {
                return NextResponse.json(
                    { error: 'Invalid custom fields format' },
                    { status: 400 }
                );
            }
        }

        const folderType = await repository.createFolderType(body as CreateFolderTypeParams);
        return NextResponse.json(folderType, { status: 201 });
    } catch (error) {
        console.error('Error creating folder type:', error);
        return NextResponse.json(
            { error: 'Failed to create folder type' },
            { status: 500 }
        );
    }
}