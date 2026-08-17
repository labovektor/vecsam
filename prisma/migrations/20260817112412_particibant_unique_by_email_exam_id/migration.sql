/*
  Warnings:

  - A unique constraint covering the columns `[email,examId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Participant_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_examId_key" ON "Participant"("email", "examId");
