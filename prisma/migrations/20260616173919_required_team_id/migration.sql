/*
  Warnings:

  - Made the column `team_id` on table `Participant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "team_id" SET NOT NULL;
