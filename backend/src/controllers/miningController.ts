import e, { Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../server";
import { get } from "node:http";

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

export const startMining = async (req: AuthenticatedRequest, res: Response) => {

  const userId = (req as AuthenticatedRequest).userId;
  const requestedResourceId = (req.body.resourceId as number);
  try {
        const activeTask = await prisma.task.findFirst({
            where: { userId: userId, status: "active" },
        });
        if (activeTask) {
            res.status(400).json({ error: "You already have an active task" });
            return;
        }

        const requestedResource = await prisma.resourceDefinition.findUnique({
            where: { id: requestedResourceId },
        });
        if (!requestedResource) {
            res.status(404).json({ error: "Resource not found" });
            return;
        }

        const userSkillCheck = await prisma.skill.findUnique({
            where: { userId_skillType: { userId: userId, skillType: "mining" } }
        });
        if (!userSkillCheck || userSkillCheck.level < requestedResource.levelRequired) {
            res.status(404).json({ error: "User skill not found or insufficient level" });
            return;
        }

        const getUserEquippedTool = await prisma.equipment.findFirst({
            where: { userId: userId, equipmentType: "pickaxe", equipped: true },
        });
        const damageModifier = getUserEquippedTool ? getUserEquippedTool.damageModifier : 0;
        const baseDamage = 5;
        const levelModifier = 2;
        const damagePerSwing = baseDamage + (levelModifier * userSkillCheck.level) + damageModifier;

        const createTask = await prisma.task.create({
            data: {
                userId: userId,
                resourceId: requestedResourceId,
                taskType: "mining",
                startTime: new Date(),
                remainingHp: requestedResource.hp,
                totalSwings: 0,
                damageDealt: 0,
                status: "active"
            }
        });
        
        res.status(201).json({ createTask, damagePerSwing });
    } catch (error) {
        console.error("Error starting mining:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};

export const getMiningStatus = async (req: AuthenticatedRequest, res: Response) => {
    const userId = (req as AuthenticatedRequest).userId;

    // Find the active mining task for the user
    const activeTask = await prisma.task.findFirst({
        where: { userId: userId, status: "active" },
    });
    if (!activeTask) {
        return res.status(404).json({ error: "No active mining task found" });
    }

    const baseGather = await prisma.resourceDefinition.findUnique({
        where: { id: activeTask.resourceId },
    });
    if (!baseGather) {
        return res.status(404).json({ error: "Resource not found" });
    }

    const gatherTime = baseGather.baseGatherTime;
    const elapsedTime = Math.floor((Date.now() - activeTask.startTime.getTime()) / 1000);
    const completedSwings = Math.floor(elapsedTime / gatherTime);
    const getUserEquippedTool = await prisma.equipment.findFirst({
            where: { userId: userId, equipmentType: "pickaxe", equipped: true },
    });
    const getUserSkill = await prisma.skill.findUnique({
        where: { userId_skillType: { userId: userId, skillType: "mining" } }
    });
    if(!getUserSkill) {
        return res.status(404).json({ error: "User skill not found" });
    }
    const baseDamage = 5;
    const levelModifier = 2;
    const damageModifier = getUserEquippedTool ? getUserEquippedTool.damageModifier : 0;
    const damagePerSwing = baseDamage + (levelModifier * getUserSkill.level) + damageModifier;
    const swingsPerCycle = Math.ceil(baseGather.hp / damagePerSwing);
    const timePerCycle = swingsPerCycle * gatherTime;
    const totalCyclesCompleted = Math.floor(elapsedTime / timePerCycle);
    const newCycles = totalCyclesCompleted - activeTask.cyclesCompleted;

    if (newCycles > 0) {
        let totalXpGained = 0;
        let totalOreGained = 0;

        // Loop through all cycles and accumulate rewards
        for (let i = 0; i < newCycles; i++) {
            let cycleXp = 0;
            for (let swing = 0; swing < swingsPerCycle; swing++) {
                const xp = Math.floor(Math.random() * 
                (baseGather.maxXpPerSwing - baseGather.minXpPerSwing + 1)) + 
                baseGather.minXpPerSwing;
                cycleXp += xp;
            }
            totalXpGained += cycleXp;
            const ore = Math.floor(Math.random() *
            (baseGather.maxOreYield - baseGather.minOreYield + 1)) + baseGather.minOreYield;
            totalOreGained += ore;
        }
        
        // After all cycles, update skill with accumulated XP
        const newTotalXp = getUserSkill.currentXp + totalXpGained;

        // Find the highest level the user qualifies for
        const qualifiedLevel = await prisma.levelRequirement.findFirst({
            where: { 
                skillType: "mining", 
                xpRequired: { lte: newTotalXp } 
            },
            orderBy: { level: 'desc' }
        });

        const newLevel = qualifiedLevel ? qualifiedLevel.level : getUserSkill.level;

    // Update skill with new XP and level
        await prisma.skill.update({
            where: { id: getUserSkill.id },
            data: { 
                level: newLevel, 
                currentXp: newTotalXp 
            }
        });
    
    // Update inventory
        await prisma.inventoryItem.upsert({
            where: {
                userId_resourceId: {
                    userId: userId,
                    resourceId: activeTask.resourceId
                }
            },
            update: {
                quantity: {
                    increment: totalOreGained
                }
            },
            create: {
                userId: userId,
                resourceId: activeTask.resourceId,
                quantity: totalOreGained
            }
        });
    
    // Update task
        await prisma.task.update({
            where: { id: activeTask.id },
            data: { cyclesCompleted: totalCyclesCompleted }
        });
    };
    // Calculate current cycle progress (for UI display)
    const timeIntoCurrentCycle = elapsedTime % timePerCycle;
    const swingsInCurrentCycle = Math.floor(timeIntoCurrentCycle / gatherTime);
    const damageInCurrentCycle = swingsInCurrentCycle * damagePerSwing;
    const remainingHpInCurrentCycle = Math.max(0, baseGather.hp - damageInCurrentCycle);
    const percentComplete = ((baseGather.hp - remainingHpInCurrentCycle) / baseGather.hp) * 100;
    return res.status(200).json({
        totalCyclesCompleted,
        currentCycle: {
            swings: swingsInCurrentCycle,
            damageDealt: damageInCurrentCycle,
            remainingHp: remainingHpInCurrentCycle,
            percentComplete: Math.round(percentComplete)
        },
        elapsedTime,
        damagePerSwing
    });
};

export const stopMining = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req as AuthenticatedRequest).userId;
  
  const activeTask = await prisma.task.findFirst({
    where: { userId: userId, status: "active" }
  });
  
  if (!activeTask) {
    return res.status(404).json({ error: "No active mining task found" });
  }
  
  // Update task to stopped
  await prisma.task.update({
    where: { id: activeTask.id },
    data: { status: "stopped" }
  });
  
  return res.status(200).json({ 
    message: "Mining stopped",
    cyclesCompleted: activeTask.cyclesCompleted 
  });
};