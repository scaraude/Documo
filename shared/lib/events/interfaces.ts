import { DocumentEventTypes, DomainEvent, EventTypes } from './types';

// Domain-specific event interfaces
// Folder events
export interface FolderCreatedEvent extends DomainEvent {
  eventType: EventTypes['FOLDER']['CREATED'];
  data: {
    folderId: string;
    name: string;
    createdById: string;
    folderTypeId: string;
  };
}

export interface FolderCompletedEvent extends DomainEvent {
  eventType: EventTypes['FOLDER']['COMPLETED'];
  data: {
    folderId: string;
    completedAt: Date;
    documentCount: number;
  };
}

export interface FolderUpdatedEvent extends DomainEvent {
  eventType: EventTypes['FOLDER']['UPDATED'];
  data: {
    folderId: string;
    changes: Record<string, unknown>;
    updatedById: string;
  };
}

export interface FolderDeletedEvent extends DomainEvent {
  eventType: EventTypes['FOLDER']['DELETED'];
  data: {
    folderId: string;
    deletedById: string;
    deletedAt: Date;
  };
}

// Request events
export interface RequestCreatedEvent extends DomainEvent {
  eventType: EventTypes['REQUEST']['CREATED'];
  data: {
    requestId: string;
    email: string;
    folderId: string;
    documentTypes: string[];
  };
}

export interface RequestAcceptedEvent extends DomainEvent {
  eventType: EventTypes['REQUEST']['ACCEPTED'];
  data: {
    requestId: string;
    acceptedAt: Date;
  };
}

export interface RequestCompletedEvent extends DomainEvent {
  eventType: EventTypes['REQUEST']['COMPLETED'];
  data: {
    requestId: string;
    completedAt: Date;
    documentCount: number;
  };
}

export interface RequestRejectedEvent extends DomainEvent {
  eventType: EventTypes['REQUEST']['REJECTED'];
  data: {
    requestId: string;
    rejectedAt: Date;
    reason?: string;
  };
}

// Document events
export interface DocumentUploadedEvent extends DomainEvent {
  eventType: DocumentEventTypes;
  data: {
    documentId: string;
    requestId: string;
    fileName: string;
    fileSize: number;
    mimeType?: string;
  };
}

export interface DocumentValidatedEvent extends DomainEvent {
  eventType: DocumentEventTypes;
  data: {
    documentId: string;
    validatedAt: Date;
    validatedBy: string;
  };
}

export interface DocumentRejectedEvent extends DomainEvent {
  eventType: DocumentEventTypes;
  data: {
    documentId: string;
    rejectedAt: Date;
    rejectedBy: string;
    reason: string;
  };
}

// Union type of all specific events
export type AllDomainEvents =
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
