import { NextFunction, Request, Response } from 'express';
import { db } from '../app';
import { User } from '../@types/user';
import cookieParser from 'cookie-parser';

const { SESSION_SECRET, SESSION_NAME } = process.env;
class SessionConfig {
    static async serializeSession(req: Request, user: User) {
        try {
            req.user = user;
            req.session.user = user;
            await db.session.upsert({
                where: {
                    sid: req.sessionID
                },
                update: {
                    expiresAt: new Date(req.session.cookie.expires!.toString())
                },
                create: {
                    id: user.dClientId.toString(),
                    sid: req.sessionID,
                    data: JSON.stringify(user),
                    expiresAt: new Date(req.session.cookie.expires!.toString())
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    static async deserializeSession(req: Request, res: Response, next: NextFunction) {
        try {
            const now = new Date();
            const { DISCORD_OAUTH2_SESSION_ID } = req.cookies;
            // cookie not present
            if (!DISCORD_OAUTH2_SESSION_ID) {
                return next();
            }

            // get sessionID from cookie
            const sessionID = cookieParser
                .signedCookie(String(DISCORD_OAUTH2_SESSION_ID), SESSION_SECRET!)
                .toString();

            // get's the user from DB using their sessionID
            const authenticatedUser = await db.session.findUnique({
                where: {
                    sid: sessionID
                }
            });

            if (authenticatedUser) {
                if (authenticatedUser.expiresAt < now) {
                    console.log('Session has expired');
                    await db.session.delete({
                        where: {
                            sid: sessionID
                        }
                    });
                    console.log('Session deleted');
                    next();
                } else {
                    console.log('Session not expired');
                    const data = JSON.parse(authenticatedUser.data);
                    console.log(data);
                    req.user = data;
                    next();
                }
            } else {
                next();
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default SessionConfig;
