import { Router, Request, Response, NextFunction } from 'express';
import { cache, db } from '../app';

const router = Router();

const testRoutes = (app: Router) => {
    app.use(router);
    router.get('/', async (req: Request, res: Response, next: NextFunction) => {
        await cache.set('key', 'value');
        const val = await cache.get('key');
        const data = await db.user.count();
        console.log(val, data);

        res.status(200).send(val);
    });
};

export default testRoutes;
