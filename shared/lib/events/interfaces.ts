import type { DocumentEventTypes, DomainEvent, EventTypes } from './types';

// Domain-specific event interfaces
// Folder events
export interface FolderCreatedEvent extends DomainEvent {
  eventType: EventTypes['FOLDER']['CREATED'];
  data: {
    folderId: string;
    name: string;
    createdByOrganizationId: string;
    folderTypeId: string;
  };
}

interface FolderCompletedEvent extends DomainEvent {
  eventType: EventTypes['FOLDER']['COMPLETED'];
  data: {
    folderId: string;
    completedAt: Date;
    documentCount: number;
  };
}

interface FolderUpdatedEvent extends DomainEvent {
  eventType: EventTypes['FOLDER']['UPDATED'];
  data: {
    folderId: string;
    changes: Record<string, unknown>;
    updatedById: string;
  };
}

interface FolderDeletedEvent extends DomainEvent {
  eventType: EventTypes['FOLDER']['DELETED'];
  data: {
    folderId: string;
    deletedById: string;
    deletedAt: Date;
  };
}

// Request events
interface RequestCreatedEvent extends DomainEvent {
  eventType: EventTypes['REQUEST']['CREATED'];
  data: {
    requestId: string;
    email: string;
    folderId: string;
    documentTypes: string[];
  };
}

interface RequestAcceptedEvent extends DomainEvent {
  eventType: EventTypes['REQUEST']['ACCEPTED'];
  data: {
    requestId: string;
    acceptedAt: Date;
  };
}

interface RequestCompletedEvent extends DomainEvent {
  eventType: EventTypes['REQUEST']['COMPLETED'];
  data: {
    requestId: string;
    completedAt: Date;
    documentCount: number;
  };
}

interface RequestRejectedEvent extends DomainEvent {
  eventType: EventTypes['REQUEST']['REJECTED'];
  data: {
    requestId: string;
    rejectedAt: Date;
    reason?: string;
  };
}

// Document events
interface DocumentUploadedEvent extends DomainEvent {
  eventType: DocumentEventTypes;
  data: {
    documentId: string;
    requestId: string;
    fileName: string;
    fileSize: number;
    mimeType?: string;
  };
}

interface DocumentValidatedEvent extends DomainEvent {
  eventType: DocumentEventTypes;
  data: {
    documentId: string;
    validatedAt: Date;
    validatedBy: string;
  };
}

interface DocumentRejectedEvent extends DomainEvent {
  eventType: DocumentEventTypes;
  data: {
    documentId: string;
    rejectedAt: Date;
    rejectedBy: string;
    reason: string;
  };
}

// Union type of all specific events
type AllDomainEvents =
  | FolderCreatedEvent
  | FolderCompletedEvent
  | FolderUpdatedEvent
  | FolderDeletedEvent
  | RequestCreatedEvent
  | RequestAcceptedEvent
  | RequestCompletedEvent
  | RequestRejectedEvent
  | DocumentUploadedEvent
  | DocumentValidatedEvent
  | DocumentRejectedEvent;
