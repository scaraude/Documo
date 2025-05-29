import { NextResponse } from 'next/server';
import * as repository from '@/features/folder-types/repository/folderTypesRepository';

// GET /api/folder-types/[id]/check-usage - Check if folder type is in use
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const isInUse = await repository.isFolderTypeInUse(params.id);
        return NextResponse.json({ isInUse });
    } catch (error) {
        console.error(`Error checking usage for folder type ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to check folder type usage' },
            { status: 500 }
        );
    }
}