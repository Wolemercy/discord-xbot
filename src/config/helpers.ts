import { AxiosRequestConfig } from 'axios';
import { UserParams } from '../@types/user';
import { db } from '../config/storage';
import DiscordConfig from './discord';
import { APIError } from './error';
import logger from './logger';

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
}
