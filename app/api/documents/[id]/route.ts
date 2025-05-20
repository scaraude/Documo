// app/api/documents/[id]/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/documents/repository/documentsRepository';

// GET /api/documents/[id] - Récupérer un document par ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const document = await repository.getDocument(params.id);
        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(document);
    } catch (error) {
        console.error(`Error fetching document with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch document' },
            { status: 500 }
        );
    }
}

// DELETE /api/documents/[id] - Supprimer un document
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await repository.deleteDocument(params.id);
        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        console.error(`Error deleting document with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to delete document' },
            { status: 500 }
        );
    }
}