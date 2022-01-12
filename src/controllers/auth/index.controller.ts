import { Router, Request, Response, NextFunction } from 'express';
import { cache, db } from '../../app';
import DiscordConfig from '../../config/discord';
import errorHandler, { UnauthorizedError } from '../../config/error';
import SessionConfig from '../../config/session';
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

                const { access_token: dAccessToken, refresh_token: dRefreshToken } = credentials;
                const { data: user } = await DiscordConfig.getDiscordUserDetails(dAccessToken);

                const newUser = await DiscordConfig.createOrUpdateUser(user, {
                    dAccessToken,
                    dRefreshToken
                });

                await SessionConfig.serializeSession(req, newUser);
                return res.status(200).send('Logged in successfully');
            } catch (err: any) {
                // errorHandler.handleError(err);
                console.log(err);
                next(err);
            }
        }
    }
}

const authController = new AuthController();

export default authController;
