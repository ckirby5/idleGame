import e, { Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../server";

export const getCharacterStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = (req as AuthenticatedRequest).userId

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if(!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const characterStats = await prisma.skill.findMany({
            where: { userId: userId },
        });

        const totalLevel = characterStats.reduce((sum, skill) => sum + skill.level, 0);

        res.json({
             username: user?.username,
             skills: characterStats,
             totalLevel: totalLevel
            });
    } catch (error) {
        console.error("Error fetching character stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}