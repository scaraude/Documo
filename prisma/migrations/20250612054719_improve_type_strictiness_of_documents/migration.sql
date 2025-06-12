/*
  Warnings:

  - You are about to drop the column `metadata` on the `documents` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalSize` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Made the column `url` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hash` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uploadedAt` on table `documents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "metadata",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalSize" INTEGER NOT NULL,
ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "hash" SET NOT NULL,
ALTER COLUMN "uploadedAt" SET NOT NULL;
