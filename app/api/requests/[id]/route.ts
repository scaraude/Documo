// app/api/requests/[id]/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/requests/repository/requestRepository';

// GET /api/requests/[id] - Récupérer une demande par ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const foundRequest = await repository.getRequestById(params.id);
        if (!foundRequest) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(foundRequest);
    } catch (error) {
        console.error(`Error fetching request with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch request' },
            { status: 500 }
        );
    }
}

// DELETE /api/requests/[id] - Supprimer une demande
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await repository.deleteRequest(params.id);
        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        console.error(`Error deleting request with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to delete request' },
            { status: 500 }
        );
    }
}