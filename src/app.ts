require('dotenv').config(); // imports the .env file to process.env
import bodyParser from 'body-parser';
import express, { Application, Response, Request, NextFunction } from 'express';
import WOKCommands from 'wokcommands';
import path from 'path';
import logger from './config/logger';
import errorHandler from './config/error';
import { BaseError } from './types/errors';
import { Client, Intents } from 'discord.js';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';
import getRoutes from '../src/routes';

const db = new PrismaClient();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });
// redis cache
const cache = createClient();

const app: Application = express();

/* LOG THE REQUEST */
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logger.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}] `);
    });
    next();
});

app.use(getRoutes());
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

// TODO: error handler
app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
    logger.info(`server.js error handler: ${err.message}`);
    errorHandler.handleError(err);
    res.status(err.httpCode || 500);
    res.json({
        errors: {
            message: err.message
        }
    });
});
// create the server
// const server = http.createServer(app);

client.on('ready', () => {
    logger.info(`Logged in as ${client?.user?.tag}!`);
    new WOKCommands(client, {
        // The name of the local folder for your command files
        commandsDir: path.join(__dirname, 'botfiles/commands'),
        // Allow importing of .ts files if you are using ts-node
        typeScript: true
    });
});

client.on('messageCreate', (msg) => {
    if (msg.author.bot) {
        return;
    }
    logger.info(msg.content);
    if (msg.content == 'ping') {
        msg.reply('pong')
            .then(() => {
                logger.info('replied');
            })
            .catch(logger.error);
    }
});

client.login(process.env.BOT_TOKEN);

cache.on('error', (err) => console.log('Redis cache Error', err));
cache.on('connect', function () {
    console.log('Cache connected! successfully');
});

app.listen(process.env.PORT, async () => {
    logger.info(`Server listening on http://localhost:${process.env.PORT}/`);
    await cache.connect();
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
