import { eventBus, EVENT_TYPES } from '@/shared/lib/events';
import {
  FolderAnalyticsHandler,
  FolderAuditHandler,
  FolderNotificationHandler,
} from '@/features/folders/events/handlers';
import logger from '@/lib/logger';

let handlersRegistered = false;

export function setupEventHandlers(): void {
  if (handlersRegistered) {
    logger.info('Event handlers already registered, skipping setup');
    return;
  }

  try {
    // Create handler instances
    const folderAnalyticsHandler = new FolderAnalyticsHandler();
    const folderAuditHandler = new FolderAuditHandler();
    const folderNotificationHandler = new FolderNotificationHandler();

    // Register folder creation event handlers
    eventBus.register(EVENT_TYPES.FOLDER.CREATED, folderAnalyticsHandler);
    eventBus.register(EVENT_TYPES.FOLDER.CREATED, folderAuditHandler);
    eventBus.register(EVENT_TYPES.FOLDER.CREATED, folderNotificationHandler);

    // Mark handlers as registered to prevent duplicate registration
    handlersRegistered = true;

    logger.info(
      {
        handlers: [
          'FolderAnalyticsHandler',
          'FolderAuditHandler',
          'FolderNotificationHandler',
        ],
        eventTypes: [EVENT_TYPES.FOLDER.CREATED],
      },
      'Event handlers registered successfully'
    );
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : error },
      'Failed to register event handlers'
    );
    throw new Error('Event handler setup failed');
  }
}

// Cleanup function for testing or graceful shutdown
export function cleanupEventHandlers(): void {
  handlersRegistered = false;
  logger.info('Event handlers cleanup completed');
}
