import { Router } from 'express';
import authController from '../../controllers/auth/index.controller';
const router = Router();

const authRoutes = (app: Router) => {
    app.use('/auth', router);
    router.get('/discord/redirect', authController.discordAuthRedirectHandler);
    router.get('/me', authController.getMe);
};

export default authRoutes;
