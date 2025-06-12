/*
  Warnings:

  - You are about to drop the column `civilId` on the `document_requests` table. All the data in the column will be lost.
  - Added the required column `email` to the `document_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_requests" DROP COLUMN "civilId",
ADD COLUMN     "email" TEXT NOT NULL;
