/*
  Warnings:

  - You are about to drop the column `postContentForId` on the `Files` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Files" DROP CONSTRAINT "Files_postContentForId_fkey";

-- AlterTable
ALTER TABLE "Files" DROP COLUMN "postContentForId";

-- CreateTable
CREATE TABLE "PostFileContent" (
    "id" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "postId" UUID NOT NULL,

    CONSTRAINT "PostFileContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostFileContent_fileId_postId_key" ON "PostFileContent"("fileId", "postId");

-- AddForeignKey
ALTER TABLE "PostFileContent" ADD CONSTRAINT "PostFileContent_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFileContent" ADD CONSTRAINT "PostFileContent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
