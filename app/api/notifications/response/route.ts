// app/api/notifications/response/route.ts
import { NextResponse } from 'next/server';
import * as notificationsRepo from '@/features/notifications/repository/notificationsRepository';

// POST /api/notifications/response - Sauvegarder une réponse à une notification
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, response } = body;

        if (!requestId || !response) {
            return NextResponse.json(
                { error: 'Request ID and response are required' },
                { status: 400 }
            );
        }

        await notificationsRepo.saveNotificationResponse(requestId, response);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving notification response:', error);
        return NextResponse.json(
            { error: 'Failed to save response' },
            { status: 500 }
        );
    }
}

// GET /api/notifications/response - Vérifier s'il y a une réponse
export async function GET() {
    try {
        const response = await notificationsRepo.checkNotificationResponse();
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error checking notification response:', error);
        return NextResponse.json(
            { error: 'Failed to check response' },
            { status: 500 }
        );
    }
}