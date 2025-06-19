/*
  Warnings:

  - Made the column `createdById` on table `folder_types` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdById` on table `folders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "folder_types" DROP CONSTRAINT "folder_types_createdById_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_createdById_fkey";

-- AlterTable
ALTER TABLE "folder_types" ALTER COLUMN "createdById" SET NOT NULL;

-- AlterTable
ALTER TABLE "folders" ALTER COLUMN "createdById" SET NOT NULL;

-- CreateTable
CREATE TABLE "_RequestDocuments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RequestDocuments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FolderDocuments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FolderDocuments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FolderTypeDocuments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FolderTypeDocuments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RequestDocuments_B_index" ON "_RequestDocuments"("B");

-- CreateIndex
CREATE INDEX "_FolderDocuments_B_index" ON "_FolderDocuments"("B");

-- CreateIndex
CREATE INDEX "_FolderTypeDocuments_B_index" ON "_FolderTypeDocuments"("B");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder_types" ADD CONSTRAINT "folder_types_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestDocuments" ADD CONSTRAINT "_RequestDocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "document_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestDocuments" ADD CONSTRAINT "_RequestDocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderDocuments" ADD CONSTRAINT "_FolderDocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderDocuments" ADD CONSTRAINT "_FolderDocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderTypeDocuments" ADD CONSTRAINT "_FolderTypeDocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderTypeDocuments" ADD CONSTRAINT "_FolderTypeDocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "folder_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
