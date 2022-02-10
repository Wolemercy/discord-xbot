import { ServerSetting } from '@prisma/client';
import { AxiosRequestConfig } from 'axios';
import { UserParams } from '../@types/user';
import { db } from '../config/storage';
import DiscordConfig from './discord';
import { APIError } from './error';
import logger from './logger';
import { Guild } from 'discord.js';
const NAMESPACE = 'Util';
export const axiosConfig: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

export class Utils {
    static encryptToken(access_token: string, refresh_token: string) {
        const dAccessToken = DiscordConfig.encryptToken(access_token).toString();
        const dRefreshToken = DiscordConfig.encryptToken(refresh_token).toString();

        return {
            dRefreshToken,
            dAccessToken
        };
    }

    static async createOrUpdateUser(user: UserParams) {
        try {
            const response = await db.user.upsert({
                where: {
                    dClientId: user.dClientId
                },
                update: {
                    dAccessToken: user.dAccessToken,
                    dRefreshToken: user.dRefreshToken,
                    dAvatar: user.dAvatar,
                    dLocale: user.dLocale,
                    dUsername: user.dUsername
                },
                create: {
                    dAccessToken: user.dAccessToken,
                    dRefreshToken: user.dRefreshToken,
                    dClientId: user.dClientId,
                    dAvatar: user.dAvatar,
                    dLocale: user.dLocale,
                    dUsername: user.dUsername,
                    isPremium: false
                }
            });

            logger.info(
                `Namespace:[${NAMESPACE}.createOrUpdateUser]: User with dClientId ${response.dClientId} updated/created.`
            );
            return {
                ...user,
                id: response.id,
                createdAt: response.createdAt.toString(),
                updatedAt: response.updatedAt.toString(),
                isPremium: response.isPremium
            };
        } catch (err: any) {
            throw new APIError(err);
        }
    }

    static formatDate(date: Date) {
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }

    static async createOrUpdateServerSetting(guild: Guild) {
        try {
            const server = await db.server.upsert({
                where: {
                    dGuildId: guild.id
                },
                update: {
                    dGuildId: guild.id,
                    dOwnerId: guild.ownerId,
                    name: guild.name
                },
                create: {
                    dGuildId: guild.id,
                    dOwnerId: guild.ownerId,
                    name: guild.name
                }
            });

            const serverConfig = await db.serverSetting.upsert({
                where: {
                    dGuildId: guild.id
                },
                update: {},
                create: {
                    dGuildId: guild.id
                }
            });

            return serverConfig;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
