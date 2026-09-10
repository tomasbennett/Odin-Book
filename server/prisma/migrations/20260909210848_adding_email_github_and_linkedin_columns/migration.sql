/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubProfileUrl]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkedInUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkedInProfileUrl]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "githubProfileUrl" TEXT,
ADD COLUMN     "githubUsername" TEXT,
ADD COLUMN     "linkedInProfileUrl" TEXT,
ADD COLUMN     "linkedInUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubUsername_key" ON "User"("githubUsername");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubProfileUrl_key" ON "User"("githubProfileUrl");

-- CreateIndex
CREATE UNIQUE INDEX "User_linkedInUsername_key" ON "User"("linkedInUsername");

-- CreateIndex
CREATE UNIQUE INDEX "User_linkedInProfileUrl_key" ON "User"("linkedInProfileUrl");
