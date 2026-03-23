import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../server";

export const getActiveTask = async (req: any, res: Response): Promise<void> => {
  const userId = (req as AuthenticatedRequest).userId;

  try {
    // Find the most recent active task for this user
    const activeTask = await prisma.task.findFirst({
      where: {
        userId: userId,
        status: "active"
      },
      include: {
        resource: true  // Include the resource definition
      },
      orderBy: {
        startTime: 'desc'
      }
    });

    if (!activeTask) {
      res.json({ hasActiveTask: false });
      return;
    }

    // Calculate progress (similar to mining status logic)
    const now = new Date();
    const elapsedTime = Math.floor((now.getTime() - activeTask.startTime.getTime()) / 1000);
    
    // Get user's skill level for damage calculation
    const skill = await prisma.skill.findUnique({
      where: {
        userId_skillType: {
          userId: userId,
          skillType: activeTask.resource.skillRequired
        }
      }
    });

    const userLevel = skill?.level || 0;
    const baseDamage = 5;
    const levelModifier = 2;
    const damagePerSwing = baseDamage + (levelModifier * userLevel);

    const swingInterval = activeTask.resource.baseGatherTime;
    const totalSwings = Math.floor(elapsedTime / swingInterval);
    const swingsPerCycle = Math.ceil(activeTask.resource.hp / damagePerSwing);
    const timePerCycle = swingsPerCycle * swingInterval;

    const totalCyclesCompleted = Math.floor(elapsedTime / timePerCycle);
    const timeIntoCurrentCycle = elapsedTime % timePerCycle;
    const swingsInCurrentCycle = Math.floor(timeIntoCurrentCycle / swingInterval);
    const damageDealtInCycle = swingsInCurrentCycle * damagePerSwing;
    const remainingHp = activeTask.resource.hp - damageDealtInCycle;
    const percentComplete = Math.floor((damageDealtInCycle / activeTask.resource.hp) * 100);

    res.json({
      hasActiveTask: true,
      taskType: activeTask.taskType,
      resourceName: activeTask.resource.name,
      skillType: activeTask.resource.skillRequired,
      cyclesCompleted: totalCyclesCompleted,
      currentProgress: {
        swings: swingsInCurrentCycle,
        damageDealt: damageDealtInCycle,
        remainingHp: remainingHp,
        percentComplete: percentComplete
      },
      elapsedTime: elapsedTime,
      damagePerSwing: damagePerSwing
    });

  } catch (error) {
    console.error("Error fetching active task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};