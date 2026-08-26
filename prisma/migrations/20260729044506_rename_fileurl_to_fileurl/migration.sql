/*
  Warnings:

  - You are about to drop the column `fileURL` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "fileURL",
ADD COLUMN     "fileUrl" TEXT;
