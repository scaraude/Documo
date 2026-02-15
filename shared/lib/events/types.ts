// Event Type Constants - Single source of truth
export const EVENT_TYPES = {
  FOLDER: {
    CREATED: 'folder.created',
    COMPLETED: 'folder.completed',
    UPDATED: 'folder.updated',
    DELETED: 'folder.deleted',
  },
  REQUEST: {
    CREATED: 'request.created',
    ACCEPTED: 'request.accepted',
    COMPLETED: 'request.completed',
    REJECTED: 'request.rejected',
  },
  DOCUMENT: {
    UPLOADED: 'document.uploaded',
    VALIDATED: 'document.validated',
    REJECTED: 'document.rejected',
  },
} as const;

// Type helpers for event types
type RequestEventTypes =
  (typeof EVENT_TYPES.REQUEST)[keyof typeof EVENT_TYPES.REQUEST];
export type DocumentEventTypes =
  (typeof EVENT_TYPES.DOCUMENT)[keyof typeof EVENT_TYPES.DOCUMENT];
type FolderEventTypes =
  (typeof EVENT_TYPES.FOLDER)[keyof typeof EVENT_TYPES.FOLDER];
export type EventTypes = typeof EVENT_TYPES;

export type EventType =
  | FolderEventTypes
  | DocumentEventTypes
  | RequestEventTypes;

// Base domain event interface
export interface DomainEvent<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TEventType extends EventType = EventType,
> {
  eventType: TEventType;
  eventId: string;
  aggregateId: string;
  organizationId?: string;
  occurredAt: Date;
  data: TData;
}

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void> | void;
}
