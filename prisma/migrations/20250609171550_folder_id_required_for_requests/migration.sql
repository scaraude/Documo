/*
  Warnings:

  - Made the column `folderId` on table `document_requests` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "document_requests" DROP CONSTRAINT "document_requests_folderId_fkey";

-- AlterTable
ALTER TABLE "document_requests" ALTER COLUMN "folderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
