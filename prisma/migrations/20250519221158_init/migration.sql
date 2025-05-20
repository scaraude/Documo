-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('IDENTITY_CARD', 'PASSPORT', 'DRIVERS_LICENSE', 'BANK_STATEMENT', 'UTILITY_BILL', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'UPLOADING', 'UPLOADED', 'VALIDATING', 'VALID', 'INVALID', 'ERROR');

-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "document_requests" (
    "id" TEXT NOT NULL,
    "civilId" TEXT NOT NULL,
    "requestedDocuments" "DocumentType"[],
    "status" "RequestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "status" "DocumentStatus" NOT NULL,
    "metadata" JSONB NOT NULL,
    "url" TEXT,
    "hash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validationErrors" TEXT[],

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
ALTER TABLE "documents" ADD CONSTRAINT "documents_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "document_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_responses" ADD CONSTRAINT "notification_responses_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "document_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
