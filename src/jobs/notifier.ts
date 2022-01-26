require('dotenv').config(); // imports the .env file to process.env
import { parentPort, workerData } from 'worker_threads';
import { db, cache } from 'src/config/storage';
import { Utils } from 'src/config/helpers';
import client from 'src/botfiles/client';
import { registerCommands, registerEvents } from '../botfiles/utils/registry';
import { Message, TextChannel } from 'discord.js';

// TODO: ADD MATCHCHANNEL TO MATCH TABLE.
// TODO: CHANGE serverId to dGuildId on Match table
// TODO: Only retrieve matches that have status Active. We can create another job that polls
// to check if any nextMatchDate is in the past when status is not paused. This tells us that the worker failed to work properly.

const MATCHCHANNELID = '931198576984469548';

const { BOT_TOKEN } = process.env;

(async () => {
    await registerCommands(client, '../commands');
    await registerEvents(client, '../events');
    await client.login(BOT_TOKEN);
    const matches = await db.match.findMany();
    const today = new Date();
    const theDay = Utils.formatDate(today);
    today.setDate(new Date().getDate() - 1);
    const aDayBefore = Utils.formatDate(today);
    for (const match of matches) {
        const nextMatchDate = Utils.formatDate(match.nextMatchDate);
        if (aDayBefore === nextMatchDate) {
            const exist = (await client.channels.fetch(MATCHCHANNELID)) as TextChannel;
            const cacheKey = `SUMPOOL-${match.serverId}`;
            if (exist) {
                await cache.sadd(cacheKey, '');
                await exist.send(
                    `Howdy learners. A new pairing would occur tomorrow. To enter the pool, call command "/matchadd me". Remember, you can only miss two pairings. Any entry after "10pm" today would not be entered into the pool. See ya and may the force by with you!`
                );
            }
        } else if (theDay === nextMatchDate) {
            // Notify AWS LAMBDA to start matching candidates.
            console.log('I logged mod');
        }
    }

    if (parentPort) parentPort.postMessage('done');
    // eslint-disable-next-line unicorn/no-process-exit
    else process.exit(0);
})();
