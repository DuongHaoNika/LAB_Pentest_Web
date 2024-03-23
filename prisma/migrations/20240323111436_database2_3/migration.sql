/*
  Warnings:

  - You are about to drop the column `passwordSalt` on the `Credential` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "passwordSalt";
