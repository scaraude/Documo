/*
  Warnings:

  - You are about to drop the column `firstRequestCreatedAt` on the `folders` table. All the data in the column will be lost.
  - You are about to drop the column `sharedWith` on the `folders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "folders" DROP COLUMN "firstRequestCreatedAt",
DROP COLUMN "sharedWith";
