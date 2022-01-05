import bodyParser from 'body-parser';
import express, { Application, Response, Request, NextFunction } from 'express';
import logger from './config/logger';
import errorHandler from './config/error';
const app: Application = express();

/* LOG THE REQUEST */
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logger.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}] `);
    });
    next();
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Hello');
});
/* PARSE THE REQUEST */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API RULES

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*'); // TODO: ensure this is removed for production
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET POST PUT PATCH DELETE');
        return res.status(200).json({});
    }
    next();
});

// create the server
// const server = http.createServer(app);
app.listen(5000, () => logger.info(`Server listening on http://localhost:${5000}/`));

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (error: Error, promise) => {
    logger.info('Unhandled Rejection', error.message);
    throw error; // will generate an uncaughtException
});

// Deals with programmer errors by exiting the node application
process.on('uncaughtException', (error) => {
    logger.info('Uncaught Exception', error.message);
    errorHandler.handleError(error);
});
