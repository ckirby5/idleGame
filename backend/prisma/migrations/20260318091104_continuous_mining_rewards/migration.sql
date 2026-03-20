/*
  Warnings:

  - You are about to drop the column `endTime` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `quantityGathered` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `xpGained` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "endTime",
DROP COLUMN "quantityGathered",
DROP COLUMN "xpGained",
ADD COLUMN     "cyclesCompleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastClaimTime" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "RewardClaim" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cyclesClaimed" INTEGER NOT NULL,
    "xpAwarded" INTEGER NOT NULL,
    "oreAwarded" INTEGER NOT NULL,

    CONSTRAINT "RewardClaim_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RewardClaim" ADD CONSTRAINT "RewardClaim_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
