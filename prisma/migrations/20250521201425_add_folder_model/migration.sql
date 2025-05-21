-- CreateEnum
CREATE TYPE "FolderStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'COMPLETED', 'PENDING');

-- AlterTable
ALTER TABLE "document_requests" ADD COLUMN     "folderId" TEXT;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "folderId" TEXT;

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "FolderStatus" NOT NULL,
    "requestedDocuments" "DocumentType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdById" TEXT,
    "sharedWith" TEXT[],

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
