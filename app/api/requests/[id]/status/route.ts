// app/api/requests/[id]/status/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/requests/repository/requestRepository';

// PUT /api/requests/[id]/status - Mettre à jour le statut d'une demande
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

        const updatedRequest = await repository.updateRequestStatus(params.id, status);
        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error(`Error updating request status for ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to update request status' },
            { status: 500 }
        );
    }
}