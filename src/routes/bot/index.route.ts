import { Router } from 'express';
import botController from '../../controllers/bot/index.controller';
const router = Router();

const botRoutes = (app: Router) => {
    app.use('/bot', router);
    router.post('/webhook/match', botController.matchResponder);
};

export default botRoutes;
