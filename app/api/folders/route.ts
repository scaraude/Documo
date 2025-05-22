// app/api/folders/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/folders/repository/folderRepository';
import { CreateFolderParams } from '@/features/folders/types';

// GET /api/folders - Get all folders
export async function GET(request: Request) {
    const url = new URL(request.url);
    const withStats = url.searchParams.get('withStats') === 'true';

    try {
        if (withStats) {
            const foldersWithStats = await repository.getFoldersWithStats();
            return NextResponse.json(foldersWithStats);
        } else {
            const folders = await repository.getFolders();
            return NextResponse.json(folders);
        }
    } catch (error) {
        console.error('Error fetching folders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch folders' },
            { status: 500 }
        );
    }
}

// POST /api/folders - Create a new folder
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const folder = await repository.createFolder(body as CreateFolderParams);
        return NextResponse.json(folder, { status: 201 });
    } catch (error) {
        console.error('Error creating folder:', error);
        return NextResponse.json(
            { error: 'Failed to create folder' },
            { status: 500 }
        );
    }
}