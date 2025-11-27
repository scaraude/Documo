import type { DomainEvent, EventType } from './types';

// Event factory with automatic ID generation
function createEvent<T extends Record<string, unknown>>(
  eventType: EventType,
  aggregateId: string,
  data: T,
  userId?: string,
): DomainEvent {
  return {
    eventType,
    eventId: crypto.randomUUID(),
    aggregateId,
    userId,
    occurredAt: new Date(),
    data,
  };
}

// Helper function to create typed events
export function createTypedEvent<T extends DomainEvent>(
  eventType: T['eventType'],
  aggregateId: string,
  data: T['data'],
  userId?: string,
): T {
  return createEvent(eventType, aggregateId, data, userId) as T;
}
