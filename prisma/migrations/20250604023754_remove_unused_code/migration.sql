/*
  Warnings:

  - You are about to drop the `notification_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `request_templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "notification_responses" DROP CONSTRAINT "notification_responses_requestId_fkey";

-- DropTable
DROP TABLE "notification_responses";

-- DropTable
DROP TABLE "request_templates";

-- DropEnum
DROP TYPE "ResponseType";
