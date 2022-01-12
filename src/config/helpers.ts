import { AxiosRequestConfig } from 'axios';
import DiscordConfig from './discord';

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
}
