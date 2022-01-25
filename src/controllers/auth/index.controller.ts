import { Request, Response, NextFunction } from 'express';
import { cache, db } from '../../config/storage';
import DiscordConfig from '../../config/discord';
import { APIError, UnauthorizedError } from '../../config/error';
import SessionConfig from '../../config/session';
import logger from '../../config/logger';
import { Utils } from '../../config/helpers';

const NAMESPACE = 'AuthController';
class AuthController {
    async getMe(req: Request, res: Response, next: NextFunction) {
        await cache.set('key', 'value');
        const val = await cache.get('key');
        const data = await db.user.count();
        console.log(val, data);

        res.status(200).send(val);
    }
    async discordLogin(req: Request, res: Response, next: NextFunction) {
        console.log(req.query);

        res.sendStatus(200);
    }

    async login(req: Request, res: Response, next: NextFunction) {}
    async discordAuthRedirectHandler(req: Request, res: Response, next: NextFunction) {
        const { code } = req.query;
        if (code) {
            try {
                const payload = DiscordConfig.buildOAuth2CredentialsRequest(code.toString());
                const { data: credentials } = await DiscordConfig.exchangeAccessCodeForCredentials(
                    payload
                );

                const { access_token, refresh_token } = credentials;
                const { data: user } = await DiscordConfig.getDiscordUserDetails(access_token);
                const encryptedTokens = Utils.encryptToken(access_token, refresh_token);

                const newUser = await DiscordConfig.createOrUpdateUser(user, encryptedTokens);

                await SessionConfig.serializeSession(req, newUser);
                return res.status(200).send('Logged in successfully');
            } catch (err: any) {
                if (err.response && err.response.data) {
                    logger.info(
                        `Namespace:[${NAMESPACE}.discordAuthRedirectHandler]: ${err.response.data.error_description}`,
                        err
                    );
                    return next(new APIError(err.response.data.error_description));
                } else if (err.request) {
                    logger.info(
                        `Namespace:[${NAMESPACE}.discordAuthRedirectHandler]: Request failed to be completed by axios`,
                        err
                    );
                    return next(
                        new UnauthorizedError('Your login request failed. Please try again.')
                    );
                }

                next(err);
            }
        }
    }
}

const authController = new AuthController();

export default authController;
