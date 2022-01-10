import { Router } from 'express';
import authController from '../../controllers/auth/index.controller';
const router = Router();

const testRoutes = (app: Router) => {
    app.use('/auth', router);
    router.get('/discord/redirect', authController.discordLogin);
};

export default testRoutes;
