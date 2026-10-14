/*
  Warnings:

  - The values [LINKEDIN] on the enum `OAuthLinks` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `linkedInProfileUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedInUsername` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,userId]` on the table `ExternalAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OAuthLinks_new" AS ENUM ('GITHUB', 'DISCORD', 'GMAIL');
ALTER TABLE "ExternalAccount" ALTER COLUMN "provider" TYPE "OAuthLinks_new" USING ("provider"::text::"OAuthLinks_new");
ALTER TABLE "OAuthSession" ALTER COLUMN "provider" TYPE "OAuthLinks_new" USING ("provider"::text::"OAuthLinks_new");
ALTER TYPE "OAuthLinks" RENAME TO "OAuthLinks_old";
ALTER TYPE "OAuthLinks_new" RENAME TO "OAuthLinks";
DROP TYPE "public"."OAuthLinks_old";
COMMIT;

-- DropIndex
DROP INDEX "User_linkedInProfileUrl_key";

-- DropIndex
DROP INDEX "User_linkedInUsername_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "linkedInProfileUrl",
DROP COLUMN "linkedInUsername",
ADD COLUMN     "discordEmail" TEXT,
ADD COLUMN     "discordUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAccount_provider_userId_key" ON "ExternalAccount"("provider", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordUsername_key" ON "User"("discordUsername");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordEmail_key" ON "User"("discordEmail");
