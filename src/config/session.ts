import { Request, Response } from 'express';
import { db } from '../app';
import { User } from '../types/user';

class Session {
    static async serializeSession(req: Request, user: User) {
        req.session.user = user;
        req.user = user;

        const session = db.session.create({
            data: {
                id: req.user.id.toString(),
                sid: req.sessionID,
                data: JSON.stringify(user),
                expiresAt: req.session.cookie.expires!.toString()
            }
        });
        return session;
    }
}

export default Session;
