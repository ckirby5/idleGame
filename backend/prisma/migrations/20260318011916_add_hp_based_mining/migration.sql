/*
  Warnings:

  - Added the required column `hp` to the `ResourceDefinition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxXpPerSwing` to the `ResourceDefinition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minXpPerSwing` to the `ResourceDefinition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResourceDefinition" ADD COLUMN     "hp" INTEGER NOT NULL,
ADD COLUMN     "maxOreYield" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxXpPerSwing" INTEGER NOT NULL,
ADD COLUMN     "minOreYield" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "minXpPerSwing" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "damageDealt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "remainingHp" INTEGER,
ADD COLUMN     "totalSwings" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Equipment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "equipmentTier" TEXT NOT NULL,
    "damageModifier" INTEGER NOT NULL,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_userId_equipmentType_equipmentTier_key" ON "Equipment"("userId", "equipmentType", "equipmentTier");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
