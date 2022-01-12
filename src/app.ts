require('dotenv').config(); // imports the .env file to process.env
import bodyParser from 'body-parser';
import express, { Application, Response, Request, NextFunction } from 'express';
import WOKCommands from 'wokcommands';
import path from 'path';
import logger from './config/logger';
import errorHandler from './config/error';
import { BaseError } from './@types/errors';
import { Intents } from 'discord.js';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import getRoutes from '../src/routes';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import SessionConfig from './config/session';
import { registerCommands, registerEvents } from './botfiles/utils/registry';
import DiscordClient from './botfiles/client/client';

const db = new PrismaClient();
const NAMESPACE = 'app.ts';

const client = new DiscordClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES]
});
// redis cache
const cache = createClient();

const app: Application = express();
const { BOT_TOKEN, PORT, SESSION_SECRET, SESSION_NAME } = process.env;
/* LOG THE REQUEST */
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logger.info(
            `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}] `
        );
    });
    next();
});

/* PARSE THE REQUEST */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// API RULES
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*'); // TODO: ensure this is removed for production
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET POST PUT PATCH DELETE');
        return res.status(200).json({});
    }
    next();
});

// TODO: error handler

app.use(
    expressSession({
        cookie: {
            // maxAge: 7 * 24 * 60 * 60 * 1000 // ms,
            maxAge: 3600000 * 24
            //   httpOnly: true,
            //   sameSite: true,
            //   secure: process.env.NODE_ENV === "production",
        },
        secret: SESSION_SECRET!,
        name: SESSION_NAME,
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(db, {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined
        })
    })
);
app.use(SessionConfig.deserializeSession);
app.use('/api/', getRoutes());
// create the server
// const server = http.createServer(app);

app.all('*', (req, res, next) => {
    res.status(404).json({
        errors: {
            status: 'fail',
            message: `Can't find ${req.originalUrl} on this server!`
        }
    });
});

// client.on('ready', () => {
//     logger.info(`Logged in as ${client?.user?.tag}!`);
//     new WOKCommands(client, {
//         // The name of the local folder for your command files
//         commandsDir: path.join(__dirname, 'botfiles/commands'),
//         // Allow importing of .ts files if you are using ts-node
//         typeScript: true
//     });
// });

// client.on('messageCreate', (msg) => {
//     if (msg.author.bot) {
//         return;
//     }
//     logger.info(msg.content);
//     if (msg.content == 'ping') {
//         msg.reply('pong')
//             .then(() => {
//                 logger.info('replied');
//             })
//             .catch(logger.error);
//     }
// });

const botLogin = async () => {
    await registerCommands(client, '../commands');
    await registerEvents(client, '../events');
    await client.login(BOT_TOKEN);
};

cache.on('error', (err) => console.log('Redis cache Error', err));
cache.on('connect', function () {
    logger.info('Cache connected! successfully');
});

app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
    logger.info(`Namespace:[${NAMESPACE} global error handler: ${err.message}`);
    errorHandler.handleError(err);
    res.status(err.httpCode || 500);
    if (err.data) {
        res.json({
            errors: {
                status: err.status,
                message: [err.message, ...err.data].join('. ')
            }
        });
    } else {
        res.json({
            errors: {
                status: err.status,
                message: err.message
            }
        });
    }
});

app.listen(PORT, async () => {
    logger.info(`Server listening on http://localhost:${PORT}/`);
    try {
        await botLogin();
        await cache.connect();
    } catch (err) {
        logger.info('Error', err);
    }
});

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

export { cache, db };
