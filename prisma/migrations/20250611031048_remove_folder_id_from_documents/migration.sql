/*
  Warnings:

  - You are about to drop the column `folderId` on the `documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_folderId_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "folderId";
