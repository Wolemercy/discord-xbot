import { Application, Router, Request, Response, NextFunction } from 'express';
import testRoutes from './test';
import matchCommandRoutes from './command/match.route';
import authRoutes from './auth/index.route';

export default () => {
    const router = Router();
    testRoutes(router);
    matchCommandRoutes(router);
    authRoutes(router);

    return router;
};
