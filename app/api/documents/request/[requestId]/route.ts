// app/api/documents/[id]/status/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/documents/repository/documentsRepository';
import { DocumentStatus } from '@/shared/constants/documents/types';

// PUT /api/documents/[id]/status - Mettre à jour le statut d'un document
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            );
        }

        const updatedDocument = await repository.updateDocumentStatus(params.id, status as DocumentStatus);
        return NextResponse.json(updatedDocument);
    } catch (error) {
        console.error(`Error updating document status for ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to update document status' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: { requestId: string } }
) {
    try {
        const documents = await repository.getDocumentsByRequest(params.requestId);
        return NextResponse.json(documents);
    } catch (error) {
        console.error(`Error fetching documents by request ${params.requestId}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch documents by request' },
            { status: 500 }
        );
    }
}