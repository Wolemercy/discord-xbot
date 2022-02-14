import { Tedis } from 'tedis';
import { PrismaClient } from '@prisma/client';

const { NODE_ENV, REDIS_URL } = process.env;

const generalConfig = {
    host: '127.0.0.1',
    port: 6379
};

const split_url = REDIS_URL?.split(':');
const CACHE_HOST = split_url![2].split('@')[1];
const CACHE_PASSWORD = split_url![2].split('@')[0];
const CACHE_PORT = split_url![3];

const prodConfig = {
    host: CACHE_HOST,
    port: Number(CACHE_PORT),
    password: CACHE_PASSWORD!,
    tls: undefined
};

const db = new PrismaClient();
const cache = new Tedis(NODE_ENV === 'production' ? prodConfig : generalConfig);

export { db, cache };
