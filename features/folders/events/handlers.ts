import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import type { EventHandler, FolderCreatedEvent } from '@/shared/lib/events';

export class FolderAnalyticsHandler
  implements EventHandler<FolderCreatedEvent>
{
  async handle(event: FolderCreatedEvent): Promise<void> {
    try {
      // Update folder type usage statistics
      await prisma.folderType.update({
        where: { id: event.data.folderTypeId },
        data: {
          // Increment usage count or update last used timestamp
          // This could be a new field in your schema
          updatedAt: event.occurredAt,
        },
      });

      logger.info(
        {
          folderId: event.data.folderId,
          folderTypeId: event.data.folderTypeId,
          organizationId: event.data.createdByOrganizationId,
        },
        'Updated folder type analytics after folder creation',
      );
    } catch (error) {
      logger.error(
        {
          folderId: event.data.folderId,
          error: error instanceof Error ? error.message : error,
        },
        'Failed to update folder analytics',
      );
      throw error;
    }
  }
}

export class FolderAuditHandler implements EventHandler<FolderCreatedEvent> {
  async handle(event: FolderCreatedEvent): Promise<void> {
    try {
      // Create audit log entry for folder creation
      // This could be stored in a separate audit table
      logger.info(
        {
          eventType: 'FOLDER_CREATED',
          folderId: event.data.folderId,
          folderName: event.data.name,
          createdByOrganizationId: event.data.createdByOrganizationId,
          folderTypeId: event.data.folderTypeId,
          timestamp: event.occurredAt,
          eventId: event.eventId,
        },
        'Folder creation audit log',
      );

      // If you have an audit table, you could insert here:
      // await prisma.auditLog.create({
      //   data: {
      //     eventType: 'FOLDER_CREATED',
      //     entityId: event.data.folderId,
      //     entityType: 'FOLDER',
      //     organizationId: event.data.createdByOrganizationId,
      //     eventData: event.data,
      //     occurredAt: event.occurredAt,
      //   },
      // });
    } catch (error) {
      logger.error(
        {
          folderId: event.data.folderId,
          error: error instanceof Error ? error.message : error,
        },
        'Failed to create audit log for folder creation',
      );
      // Don't throw for audit failures - they shouldn't break the main flow
    }
  }
}

export class FolderNotificationHandler
  implements EventHandler<FolderCreatedEvent>
{
  async handle(event: FolderCreatedEvent): Promise<void> {
    try {
      // Send notification to user about successful folder creation
      // This could integrate with your notification system
      logger.info(
        {
          organizationId: event.data.createdByOrganizationId,
          folderId: event.data.folderId,
          folderName: event.data.name,
          notificationType: 'FOLDER_CREATED_SUCCESS',
        },
        'Folder creation notification sent',
      );

      // Example: Send email or push notification
      // await notificationService.send({
      //   organizationId: event.data.createdByOrganizationId,
      //   type: 'FOLDER_CREATED',
      //   data: {
      //     folderName: event.data.name,
      //     folderId: event.data.folderId,
      //   },
      // });
    } catch (error) {
      logger.error(
        {
          folderId: event.data.folderId,
          error: error instanceof Error ? error.message : error,
        },
        'Failed to send folder creation notification',
      );
      // Don't throw for notification failures
    }
  }
}
