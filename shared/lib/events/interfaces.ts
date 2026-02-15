import type { DomainEvent, EventTypes } from './types';

// Domain-specific event interfaces
// Folder events
export interface FolderCreatedEvent
  extends DomainEvent<
    {
      folderId: string;
      name: string;
      createdByOrganizationId: string;
      folderTypeId: string;
    },
    EventTypes['FOLDER']['CREATED']
  > {}

interface FolderCompletedEvent
  extends DomainEvent<
    {
      folderId: string;
      completedAt: Date;
      documentCount: number;
    },
    EventTypes['FOLDER']['COMPLETED']
  > {}

interface FolderUpdatedEvent
  extends DomainEvent<
    {
      folderId: string;
      changes: Record<string, unknown>;
      updatedById: string;
    },
    EventTypes['FOLDER']['UPDATED']
  > {}

interface FolderDeletedEvent
  extends DomainEvent<
    {
      folderId: string;
      deletedById: string;
      deletedAt: Date;
    },
    EventTypes['FOLDER']['DELETED']
  > {}

// Request events
interface RequestCreatedEvent
  extends DomainEvent<
    {
      requestId: string;
      email: string;
      folderId: string;
      documentTypes: string[];
    },
    EventTypes['REQUEST']['CREATED']
  > {}

interface RequestAcceptedEvent
  extends DomainEvent<
    {
      requestId: string;
      acceptedAt: Date;
    },
    EventTypes['REQUEST']['ACCEPTED']
  > {}

interface RequestCompletedEvent
  extends DomainEvent<
    {
      requestId: string;
      completedAt: Date;
      documentCount: number;
    },
    EventTypes['REQUEST']['COMPLETED']
  > {}

interface RequestRejectedEvent
  extends DomainEvent<
    {
      requestId: string;
      rejectedAt: Date;
      reason?: string;
    },
    EventTypes['REQUEST']['REJECTED']
  > {}

// Document events
interface DocumentUploadedEvent
  extends DomainEvent<
    {
      documentId: string;
      requestId: string;
      fileName: string;
      fileSize: number;
      mimeType?: string;
    },
    EventTypes['DOCUMENT']['UPLOADED']
  > {}

interface DocumentValidatedEvent
  extends DomainEvent<
    {
      documentId: string;
      validatedAt: Date;
      validatedBy: string;
    },
    EventTypes['DOCUMENT']['VALIDATED']
  > {}

interface DocumentRejectedEvent
  extends DomainEvent<
    {
      documentId: string;
      rejectedAt: Date;
      rejectedBy: string;
      reason: string;
    },
    EventTypes['DOCUMENT']['REJECTED']
  > {}

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
