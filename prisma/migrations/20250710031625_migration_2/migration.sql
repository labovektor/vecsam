/*
  Warnings:

  - You are about to drop the column `password` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ParticipantSession` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Section` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[passcode]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[participantId,questionId]` on the table `ParticipantAnswer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[participantId]` on the table `ParticipantSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passcode` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantId` to the `ParticipantSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `ParticipantSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correctPoint` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passPoint` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrongPoint` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParticipantAnswer" DROP CONSTRAINT "ParticipantAnswer_optionId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "password",
DROP COLUMN "username",
ADD COLUMN     "passcode" TEXT NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ParticipantAnswer" ALTER COLUMN "optionId" DROP NOT NULL,
ALTER COLUMN "isTrue" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ParticipantSession" DROP COLUMN "userId",
ADD COLUMN     "participantId" TEXT NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuestionAttr" ALTER COLUMN "file" DROP NOT NULL,
ALTER COLUMN "templateFile" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "points",
ADD COLUMN     "correctPoint" INTEGER NOT NULL,
ADD COLUMN     "passPoint" INTEGER NOT NULL,
ADD COLUMN     "wrongPoint" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_passcode_key" ON "Participant"("passcode");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantAnswer_participantId_questionId_key" ON "ParticipantAnswer"("participantId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantSession_participantId_key" ON "ParticipantSession"("participantId");

-- AddForeignKey
ALTER TABLE "ParticipantSession" ADD CONSTRAINT "ParticipantSession_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
