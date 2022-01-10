import { Router } from 'express';
import authController from '../../controllers/auth/index.controller';
const router = Router();

const testRoutes = (app: Router) => {
    app.use('/command/match', router);
    router.get('/', authController.getMe);
};

export default testRoutes;
