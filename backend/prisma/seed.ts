import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const copperOre = await prisma.resourceDefinition.upsert({
        where: { name: "Copper Ore" },
        update: {},
        create: {
            name: "Copper Ore",
            resourceType: "ore",
            skillRequired: "mining",
            levelRequired: 0,
            hp: 50,
            baseGatherTime: 2,
            minXpPerSwing: 10,
            maxXpPerSwing: 20,
            minOreYield: 1,
            maxOreYield: 3,
            baseXpReward: 0,
            description: "A common copper ore node",
            sellValue: 5,
            stackLimit: 100
        }
    });

    const ironOre = await prisma.resourceDefinition.upsert({
        where: { name: "Iron Ore" },
        update: {},
        create: {
            name: "Iron Ore",
            resourceType: "ore",
            skillRequired: "mining",
            levelRequired: 3,
            hp: 75,
            baseGatherTime: 2,
            minXpPerSwing: 15,
            maxXpPerSwing: 25,
            minOreYield: 1,
            maxOreYield: 3,
            baseXpReward: 0,
            description: "A common iron ore node",
            sellValue: 8,
            stackLimit: 100
        }
    });

    const coalOre = await prisma.resourceDefinition.upsert({
        where: { name: "Coal Ore" },
        update: {},
        create: {
            name: "Coal Ore",
            resourceType: "ore",
            skillRequired: "mining",
            levelRequired: 5,
            hp: 100,
            baseGatherTime: 2,
            minXpPerSwing: 20,
            maxXpPerSwing: 30,
            minOreYield: 1,
            maxOreYield: 3,
            baseXpReward: 0,
            description: "A common coal ore node",
            sellValue: 10,
            stackLimit: 100
        }
    });

    console.log('Seeded resources:', { copperOre, ironOre, coalOre });
}

main().catch((e) => {
    console.error('Error seeding resources:', e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
