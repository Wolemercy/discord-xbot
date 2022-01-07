import { Application, Router, Request, Response, NextFunction } from 'express';
import testRoutes from './test';

export default () => {
    const router = Router();
    testRoutes(router);

    return router;
};
