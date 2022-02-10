import { Application, Router, Request, Response, NextFunction } from 'express';
import matchCommandRoutes from './command/match.route';
import authRoutes from './auth/index.route';
import botRoutes from './bot/index.route';

export default () => {
    const router = Router();
    matchCommandRoutes(router);
    authRoutes(router);
    botRoutes(router);

    return router;
};
