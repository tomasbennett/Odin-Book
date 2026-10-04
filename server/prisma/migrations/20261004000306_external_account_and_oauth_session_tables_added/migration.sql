-- CreateEnum
CREATE TYPE "OAuthLinks" AS ENUM ('GITHUB', 'LINKEDIN', 'GMAIL');

-- CreateEnum
CREATE TYPE "OAuthPurpose" AS ENUM ('LOGIN', 'LINK');

-- CreateTable
CREATE TABLE "ExternalAccount" (
    "id" UUID NOT NULL,
    "provider" "OAuthLinks" NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "providerEmail" TEXT,
    "providerUsername" TEXT,
    "profileUrl" TEXT,

    CONSTRAINT "ExternalAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthSession" (
    "id" UUID NOT NULL,
    "state" TEXT NOT NULL,
    "provider" "OAuthLinks" NOT NULL,
    "userId" UUID,
    "purpose" "OAuthPurpose" NOT NULL,
    "codeVerifier" TEXT NOT NULL,
    "codeChallenge" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAccount_provider_providerId_key" ON "ExternalAccount"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthSession_state_key" ON "OAuthSession"("state");

-- AddForeignKey
ALTER TABLE "ExternalAccount" ADD CONSTRAINT "ExternalAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthSession" ADD CONSTRAINT "OAuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
