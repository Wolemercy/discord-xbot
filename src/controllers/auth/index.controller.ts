import { Router, Request, Response, NextFunction } from 'express';
import { cache, db } from '../../app';

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
}

const authController = new AuthController();

export default authController;
