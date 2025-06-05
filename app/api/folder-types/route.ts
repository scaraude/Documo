import { NextResponse } from 'next/server';
import * as repository from '@/features/folder-types/repository/folderTypesRepository';
import { createFolderTypeSchema } from '@/shared/types';

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

        // Validate the request body
        const validationResult = createFolderTypeSchema.safeParse(body);
        
        if (!validationResult.success) {
            return NextResponse.json(
                { 
                    error: 'Invalid request data',
                    details: validationResult.error.flatten()
                },
                { status: 400 }
            );
        }

        const folderType = await repository.createFolderType(validationResult.data);

        return NextResponse.json(folderType, { status: 201 });
    } catch (error) {
        console.error('Error creating folder type:', error);
        return NextResponse.json(
            { error: 'Failed to create folder type' },
            { status: 500 }
        );
    }
}