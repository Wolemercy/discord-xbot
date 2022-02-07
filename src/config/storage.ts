import { Tedis } from 'tedis';
import { PrismaClient } from '@prisma/client';

const { NODE_ENV, CAHE_PORT, CACHE_HOST, CACHE_PASSWORD } = process.env;

const generalConfig = {
    host: '127.0.0.1',
    port: 6379
};
const prodConfig = {
    host: CACHE_HOST,
    port: Number(CAHE_PORT),
    password: CACHE_PASSWORD!,
    tls: undefined
};

const db = new PrismaClient();
const cache = new Tedis(NODE_ENV === 'production' ? prodConfig : generalConfig);

export { db, cache };
