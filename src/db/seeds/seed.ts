import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const matchingJSON = [
        {
            lastMatchDate: 'now',
            nextMatchDate: 'now',
            frequency: 7
        }
    ] as Prisma.JsonArray;

    const module = await prisma.module.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            id: 1,
            name: 'Matching',
            description: 'The module that handles matching users in a guild (server).',
            defaultPermissions: matchingJSON,
            isPremium: false
        }
    });

    console.log({ module });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
