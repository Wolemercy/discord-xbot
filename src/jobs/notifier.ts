require('dotenv').config(); // imports the .env file to process.env
import { parentPort } from 'worker_threads';
import { db, cache } from '../config/storage';
import { Utils } from '../config/helpers';
import client from '../botfiles/client';
import { registerCommands, registerEvents } from '../botfiles/utils/registry';
import { TextChannel } from 'discord.js';
import { Lambda } from '@aws-sdk/client-lambda';
import logger from '../config/logger';

// TODO: ADD MATCHCHANNEL TO MATCH TABLE.
// TODO: CHANGE serverId to dGuildId on Match table
// TODO: Only retrieve matches that have status Active. We can create another job that polls
// to check if any nextMatchDate is in the past when status is not paused. This tells us that the worker failed to work properly.

const {
    BOT_TOKEN,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_LAMBDA_FUNCTION_NAME
} = process.env;

(async () => {
    await registerCommands(client, '../commands');
    await registerEvents(client, '../events');
    await client.login(BOT_TOKEN);
    const matches = await db.match.findMany({
        where: {
            status: {
                in: ['ACTIVE', 'FAILED']
            }
        }
    });
    const today = new Date();
    const theDay = Utils.formatDate(today);
    for (const match of matches) {
        const nextMatchDate = Utils.formatDate(match.nextMatchDate);
        match.nextMatchDate.setDate(match.nextMatchDate.getDate() - 1);
        const aDayBeforeMatchDate = Utils.formatDate(new Date(match.nextMatchDate));

        if (theDay === aDayBeforeMatchDate) {
            const channel = (await client.channels.fetch(match.matchChannelId)) as TextChannel;
            const cacheKey = `SUMPOOL-${match.dGuildId}`;
            if (channel) {
                await cache.sadd(cacheKey, '');
                await channel.send(
                    `Howdy learners. A new pairing would occur tomorrow. To enter the pool, call command "/matchadd me". Remember, you can only miss two pairings. Any entry after "10pm CET" today would not be entered into the pool. See ya and may the force be with you!`
                );
            }
        } else if (theDay === nextMatchDate) {
            try {
                const lambdaClient = new Lambda({
                    credentials: {
                        accessKeyId: AWS_ACCESS_KEY_ID!,
                        secretAccessKey: AWS_SECRET_ACCESS_KEY!
                    },
                    region: AWS_REGION!
                });

                const invocationConfig = {
                    FunctionName: AWS_LAMBDA_FUNCTION_NAME!,
                    InvocationType: 'Event',
                    Payload: new TextEncoder().encode(JSON.stringify({ guildId: match.dGuildId }))
                };

                const invokationResult = await lambdaClient.invoke(invocationConfig);
                console.log(invokationResult);
                logger.info(
                    `Successfully invoked lambda function to perform matches for match-date ${nextMatchDate}`
                );
            } catch (error: any) {
                logger.info(
                    `Failed to invoke lambda function to perform matches for match-date ${nextMatchDate}`,
                    error.message
                );
                // logger.error(
                //     `Failed to invoke lambda function to perform matches for match-date ${nextMatchDate}`,
                //     error
                // );
            }
            // Notify AWS LAMBDA to start matching candidates.
        }
    }

    if (parentPort) parentPort.postMessage('done');
    // eslint-disable-next-line unicorn/no-process-exit
    else process.exit(0);
})();
