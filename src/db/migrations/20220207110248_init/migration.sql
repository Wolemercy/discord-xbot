/*
  Warnings:

  - You are about to drop the column `guidId` on the `Match` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dGuidId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dGuidId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_guidId_fkey";

-- DropIndex
DROP INDEX "Match_guidId_key";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "guidId",
ADD COLUMN     "dGuidId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match_dGuidId_key" ON "Match"("dGuidId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_dGuidId_fkey" FOREIGN KEY ("dGuidId") REFERENCES "Server"("dGuildId") ON DELETE RESTRICT ON UPDATE CASCADE;
