// app/api/external/upload/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/documents/repository/documentsRepository';
import * as externalRequestsRepository from '@/features/external-requests/repository/externalRequestsRepository';
import { AppDocumentWithoutRequestId } from '../../../../features/external-requests/types';

// POST /api/external/upload - Upload un document encrypté
export async function POST(request: Request) {
    try {
        // Utiliser formData pour gérer les fichiers
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const token = formData.get('token')?.slice(1, -1) as string;
        const documentData = JSON.parse(formData.get('document') as string) as AppDocumentWithoutRequestId;

        const shareLink = await externalRequestsRepository.getShareLinkByToken(token);

        if (!shareLink) {
            return NextResponse.json(
                { error: 'Share link not found: ', token },
                { status: 404 }
            );
        }
        const requestId = shareLink.request.id;
        const folderId = shareLink.request.folderId || undefined;

        if (!file || !documentData) {
            return NextResponse.json(
                { error: 'File and document data are required' },
                { status: 400 }
            );
        }

        // Sauvegarder le document dans la base de données
        const uploadedDocument = await repository.uploadDocument({ ...documentData, requestId, folderId });

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