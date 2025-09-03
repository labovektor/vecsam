/*
  Warnings:

  - You are about to drop the column `passcode` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Participant_passcode_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "passcode",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");
