// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import * as notificationsRepo from '@/features/notifications/repository/notificationsRepository';
import { DocumentRequest } from '@/shared/types';

// POST /api/notifications - Envoyer une notification
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await notificationsRepo.sendNotification(body as DocumentRequest);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json(
            { error: 'Failed to send notification' },
            { status: 500 }
        );
    }
}

// GET /api/notifications/pending - Récupérer les notifications en attente
export async function GET() {
    try {
        const notification = await notificationsRepo.getPendingNotification();
        return NextResponse.json(notification);
    } catch (error) {
        console.error('Error getting pending notification:', error);
        return NextResponse.json(
            { error: 'Failed to get notification' },
            { status: 500 }
        );
    }
}