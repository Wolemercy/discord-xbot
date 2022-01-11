import {
    DiscordOAuth2CredentialsResponse,
    DiscordOAuth2ExchangeRequestParams,
    DiscordOAuth2UserResponse,
    DISCORD_API_ROUTES,
    EncryptedTokens,
    UserParams,
    User
} from '../@types/user';
import { AxiosRequestConfig } from 'axios';
import url from 'url';
import axios from 'axios';
import { axiosConfig } from './helpers';
import { db } from '../app';
import { APIError } from './error';
import { NextFunction } from 'express';

const { BOT_TOKEN, PORT, SESSION_SECRET, DISCORD_OAUTH_SECRET, DISCORD_REDIRECT_URL, CLIENT_ID } =
    process.env;

class DiscordConfig {
    static buildOAuth2CredentialsRequest(code: string, grant_type = 'authorization_code') {
        return {
            code,
            grant_type,
            client_id: CLIENT_ID || '',
            client_secret: DISCORD_OAUTH_SECRET || '',
            redirect_uri: DISCORD_REDIRECT_URL || ''
        };
    }

    static buildUserResponse(
        user: DiscordOAuth2UserResponse,
        credentials: EncryptedTokens
    ): UserParams {
        return {
            dClientId: user.id,
            dAvatar: user.avatar,
            dAccessToken: credentials.dAccessToken,
            dRefreshToken: credentials.dRefreshToken,
            dLocale: user.locale,
            dUsername: user.username
        };
    }

    static buildOAuth2RequestPayload(data: DiscordOAuth2ExchangeRequestParams): string {
        return new url.URLSearchParams(data).toString();
    }

    static authHeaders(accessToken: string): AxiosRequestConfig {
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
    }

    static async exchangeAccessCodeForCredentials(data: DiscordOAuth2ExchangeRequestParams) {
        const payload = this.buildOAuth2RequestPayload(data);
        return axios.post<DiscordOAuth2CredentialsResponse>(
            DISCORD_API_ROUTES.OAUTH2_TOKEN,
            payload,
            axiosConfig
        );
    }
    static async getDiscordUserDetails(accessToken: string) {
        return axios.get<DiscordOAuth2UserResponse>(
            DISCORD_API_ROUTES.OAUTH2_USER,
            this.authHeaders(accessToken)
        );
    }

    static async createOrUpdateUser(
        user: DiscordOAuth2UserResponse,
        credentials: EncryptedTokens,
        next: NextFunction
    ): Promise<User | void> {
        const builtUser = this.buildUserResponse(user, credentials);

        try {
            const response = await db.user.upsert({
                where: {
                    dClientId: builtUser.dClientId
                },
                update: {
                    dAccessToken: builtUser.dAccessToken,
                    dRefreshToken: builtUser.dRefreshToken,
                    dAvatar: builtUser.dAvatar,
                    dLocale: builtUser.dLocale,
                    dUsername: builtUser.dUsername
                },
                create: {
                    dAccessToken: builtUser.dAccessToken,
                    dRefreshToken: builtUser.dRefreshToken,
                    dClientId: builtUser.dClientId,
                    dAvatar: builtUser.dAvatar,
                    dLocale: builtUser.dLocale,
                    dUsername: builtUser.dUsername,
                    isPremium: false
                }
            });

            if (!response) {
                throw new APIError(
                    'Server error, could not log you in at this moment. Please try again'
                );
            }

            return {
                ...builtUser,
                id: response.id,
                createdAt: response.createdAt.toString(),
                updatedAt: response.updatedAt.toString(),
                isPremium: response.isPremium
            };
        } catch (err: any) {
            return next(err);
        }
    }
}

export default DiscordConfig;
