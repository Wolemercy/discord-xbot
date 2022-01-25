import { Tedis } from 'tedis';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const cache = new Tedis({
    host: '127.0.0.1',
    port: 6379
});

export { db, cache };
