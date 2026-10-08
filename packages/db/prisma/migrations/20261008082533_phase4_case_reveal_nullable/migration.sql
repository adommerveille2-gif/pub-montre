-- AlterTable
ALTER TABLE "CaseAttemptStep" ALTER COLUMN "revealedAt" DROP NOT NULL,
ALTER COLUMN "revealedAt" DROP DEFAULT;
