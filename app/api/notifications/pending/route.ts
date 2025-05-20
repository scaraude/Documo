import { NextResponse } from 'next/server';
import * as notificationsRepo from '@/features/notifications/repository/notificationsRepository';

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
