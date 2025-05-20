// app/api/requests/route.ts
import { NextResponse } from 'next/server';
import * as repository from '@/features/requests/repository/requestRepository';
import { CreateRequestParams } from '@/features/requests/types';

// GET /api/requests - Récupérer toutes les demandes
export async function GET() {
    try {
        const requests = await repository.getRequests();
        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch requests' },
            { status: 500 }
        );
    }
}

// POST /api/requests - Créer une nouvelle demande
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newRequest = await repository.createRequest(body as CreateRequestParams);
        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.error('Error creating request:', error);
        return NextResponse.json(
            { error: 'Failed to create request' },
            { status: 500 }
        );
    }
}