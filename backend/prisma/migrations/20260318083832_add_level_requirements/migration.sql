-- CreateTable
CREATE TABLE "LevelRequirement" (
    "id" SERIAL NOT NULL,
    "skillType" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "xpRequired" INTEGER NOT NULL,

    CONSTRAINT "LevelRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LevelRequirement_skillType_level_key" ON "LevelRequirement"("skillType", "level");
