// app/api/documents/upload/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/documents/repository/documentsRepository';
import { AppDocument } from '@/shared/types';

// POST /api/documents/upload - Upload un document encrypté
export async function POST(request: Request) {
    try {
        // Utiliser formData pour gérer les fichiers
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const documentData = JSON.parse(formData.get('document') as string) as AppDocument;

        if (!file || !documentData) {
            return NextResponse.json(
                { error: 'File and document data are required' },
                { status: 400 }
            );
        }

        // Sauvegarder le document dans la base de données
        const uploadedDocument = await repository.uploadDocument(documentData);

        // Ici vous pourriez ajouter la logique pour stocker le fichier encrypté
        // dans un système de stockage (S3, Azure Blob, etc.)

        return NextResponse.json(uploadedDocument, { status: 201 });
    } catch (error) {
        console.error('Error uploading document:', error);
        return NextResponse.json(
            { error: 'Failed to upload document' },
            { status: 500 }
        );
    }
}