// app/api/documents/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/documents/repository/documentsRepository';
import { AppDocument } from '@/shared/types';

// GET /api/documents - Récupérer tous les documents
export async function GET() {
    try {
        const documents = await repository.getDocuments();
        return NextResponse.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        );
    }
}

// POST /api/documents - Upload un nouveau document
export async function POST(request: Request) {
    try {
        const document = await request.json() as AppDocument;
        const uploadedDocument = await repository.uploadDocument(document);
        return NextResponse.json(uploadedDocument, { status: 201 });
    } catch (error) {
        console.error('Error uploading document:', error);
        return NextResponse.json(
            { error: 'Failed to upload document' },
            { status: 500 }
        );
    }
}