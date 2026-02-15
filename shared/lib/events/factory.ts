import type { DomainEvent, EventType } from './types';

// Event factory with automatic ID generation
function createEvent<
  TData extends Record<string, unknown>,
  TEventType extends EventType,
>(
  eventType: TEventType,
  aggregateId: string,
  data: TData,
  organizationId?: string,
): DomainEvent<TData, TEventType> {
  return {
    eventType,
    eventId: crypto.randomUUID(),
    aggregateId,
    organizationId,
    occurredAt: new Date(),
    data,
  };
}

// Helper function to create typed events
export function createTypedEvent<T extends DomainEvent>(
  eventType: T['eventType'],
  aggregateId: string,
  data: T['data'],
  organizationId?: string,
): T {
  return createEvent<T['data'], T['eventType']>(
    eventType,
    aggregateId,
    data,
    organizationId,
  ) as T;
}
