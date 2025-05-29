-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('IDENTITY_CARD', 'PASSPORT', 'DRIVERS_LICENSE', 'BANK_STATEMENT', 'UTILITY_BILL', 'OTHER');

-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requestedDocuments" "DocumentType"[],
    "customFieldsData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "firstRequestCreatedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdById" TEXT,
    "sharedWith" TEXT[],
    "folderTypeId" TEXT,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folder_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requiredDocuments" "DocumentType"[],
    "customFields" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,

    CONSTRAINT "folder_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_requests" (
    "id" TEXT NOT NULL,
    "civilId" TEXT NOT NULL,
    "requestedDocuments" "DocumentType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "firstDocumentUploadedAt" TIMESTAMP(3),
    "folderId" TEXT,

    CONSTRAINT "document_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "metadata" JSONB NOT NULL,
    "url" TEXT,
    "hash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploadedAt" TIMESTAMP(3),
    "validatedAt" TIMESTAMP(3),
    "invalidatedAt" TIMESTAMP(3),
    "errorAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "validationErrors" TEXT[],
    "folderId" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "requestedDocuments" "DocumentType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_responses" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "response" "ResponseType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notification_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_folderTypeId_fkey" FOREIGN KEY ("folderTypeId") REFERENCES "folder_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "document_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_responses" ADD CONSTRAINT "notification_responses_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "document_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
