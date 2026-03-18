import { Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../server";



/**
 * Return the list of available resources for the authenticated user.
 */
export const getAvailableResources = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = (req as AuthenticatedRequest).userId

    try {
        const userSkill = await prisma.skill.upsert({
            where: { userId_skillType: { userId: userId, skillType: "mining" } },
            update: {},
            create: { userId: userId, skillType: "mining", level: 0, currentXp: 0 }
        });
        const userResources = await prisma.resourceDefinition.findMany ({
            where: { skillRequired: "mining", levelRequired: { lte: userSkill.level } },
        });

        res.json({ 
            miningLevel: userSkill.level,
            currentXp: userSkill.currentXp, 
            availableOres: userResources 
        });
    } catch (error) {
        console.error("Error getting user resources:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};



/**

 * Start a mining job for the authenticated user.

 */

export const startMining = (req: AuthenticatedRequest, res: Response) => {

  // TODO: start mining and persist job state

  res.status(202).json({ status: "started", jobId: null });

};



/**

 * Return current mining status for the authenticated user.

 */

export const getMiningStatus = (req: AuthenticatedRequest, res: Response) => {

  // TODO: return real status/progress

  res.json({ status: "idle", progress: 0 });

};



/**

 * Claim mined resources for the authenticated user.

 */

export const claimMiningResources = (req: AuthenticatedRequest, res: Response) => {

  // TODO: implement claiming logic

  res.json({ claimed: [], remaining: [] });

};