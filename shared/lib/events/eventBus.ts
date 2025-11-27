import logger from '@/lib/logger';
import type { DomainEvent, EventHandler, EventType } from './types';

class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  register<T extends DomainEvent>(
    eventType: EventType,
    handler: EventHandler<T>,
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)?.push(handler as EventHandler);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];

    logger.info(
      {
        eventType: event.eventType,
        eventId: event.eventId,
        aggregateId: event.aggregateId,
        handlerCount: handlers.length,
      },
      'Publishing domain event',
    );

    // Process handlers in parallel for performance
    const promises = handlers.map(async (handler) => {
      try {
        await handler.handle(event);
      } catch (error) {
        logger.error(
          {
            eventType: event.eventType,
            eventId: event.eventId,
            handlerName: handler.constructor.name,
            error: error instanceof Error ? error.message : error,
          },
          'Event handler failed',
        );
        // Don't throw - continue processing other handlers
      }
    });

    await Promise.allSettled(promises);
  }
}

export const eventBus = new EventBus();
