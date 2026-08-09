-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "descendantRepliesCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "descendantRepliesCount" INTEGER NOT NULL DEFAULT 0;
