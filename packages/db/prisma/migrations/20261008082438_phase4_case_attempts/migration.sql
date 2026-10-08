-- CreateTable
CREATE TABLE "CaseAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "CaseAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseAttemptStep" (
    "attemptId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "revealedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseAttemptStep_pkey" PRIMARY KEY ("attemptId","stepId")
);

-- CreateIndex
CREATE INDEX "CaseAttempt_userId_caseId_idx" ON "CaseAttempt"("userId", "caseId");

-- AddForeignKey
ALTER TABLE "CaseAttempt" ADD CONSTRAINT "CaseAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAttempt" ADD CONSTRAINT "CaseAttempt_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ClinicalCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAttemptStep" ADD CONSTRAINT "CaseAttemptStep_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "CaseAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAttemptStep" ADD CONSTRAINT "CaseAttemptStep_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "ClinicalCaseStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
