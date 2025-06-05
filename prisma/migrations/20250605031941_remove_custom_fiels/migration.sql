/*
  Warnings:

  - You are about to drop the column `customFields` on the `folder_types` table. All the data in the column will be lost.
  - You are about to drop the column `customFieldsData` on the `folders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "folder_types" DROP COLUMN "customFields";

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "customFieldsData";
