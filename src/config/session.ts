import { Request, Response } from 'express';
import { db } from '../app';
import { User } from '../@types/user';

class SessionConfig {
    static async serializeSession(req: Request, user: User) {
        try {
            req.user = user;

            req.session.user = user;
            await db.session.upsert({
                where: {
                    sid: req.sessionID
                },
                update: {},
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
}

export default SessionConfig;
