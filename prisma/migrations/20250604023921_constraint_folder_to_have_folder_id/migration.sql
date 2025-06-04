/*
  Warnings:

  - Made the column `folderTypeId` on table `folders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_folderTypeId_fkey";

-- AlterTable
ALTER TABLE "folders" ALTER COLUMN "folderTypeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_folderTypeId_fkey" FOREIGN KEY ("folderTypeId") REFERENCES "folder_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
