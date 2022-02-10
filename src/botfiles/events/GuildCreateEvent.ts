// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
import { Guild } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { db, cache } from '../../config/storage';
import logger from '../../config/logger';
import { Utils } from '../../config/helpers';

const NAMESPACE = 'GuildCreateEvent';
export default class GuildCreateEvent extends BaseEvent {
    constructor() {
        super('guildCreate');
    }

    async run(client: DiscordClient, guild: Guild) {
        logger.info(`xBot Joined ${guild.name} guild`);

        try {
            // retrieve server config from cache
            let serverConfig = (await cache.get(guild.id)) as any;
            // server config not found meaning it's a new server
            if (!serverConfig) {
                logger.info(
                    `${NAMESPACE}.run: Guild (server) with dGuildId:${guild.id} config not found in cache.`,
                    {
                        guildId: guild.id
                    }
                );
            } else {
                logger.info(
                    `${NAMESPACE}.run: Guild (server) with dGuildId:${guild.id} config found in cache.`,
                    {
                        guildId: guild.id
                    }
                );
            }
            // create or update server and server setting for this guild
            serverConfig = await Utils.createOrUpdateServerSetting(guild);
            // add or updates it to the cache
            await cache.set(guild.id, JSON.stringify(serverConfig));
            logger.info(
                `${NAMESPACE}.run: New guild (server) config with dGuildId:${guild.id} added/updated in cache.`,
                {
                    guildId: guild.id
                }
            );
            // retrieves all this guild's current channel
            const channels = await guild.channels.fetch();
            // finds the desired channel
            let generalChannel = channels.find(
                (channel) =>
                    channel.name.toLowerCase() === 'general' && channel.type === 'GUILD_TEXT'
            );
            // creates it if not found
            if (!generalChannel) {
                generalChannel = await guild.channels.create('general', {
                    reason: 'General Channel needed for xBot to work',
                    type: 'GUILD_TEXT'
                });
            }
            // creates a record for matches
            const setMatchRecord = await db.match.create({
                data: {
                    status: 'PAUSED',
                    dGuildId: guild.id,
                    serverOwnerId: guild.ownerId,
                    matchFrequency: 7,
                    lastMatchDate: new Date(),
                    nextMatchDate: new Date(new Date().setDate(new Date().getDate() + 7)),
                    matchChannelId: generalChannel.id
                }
            });
            // successfully created
            if (setMatchRecord) {
                (await (await guild.fetchOwner()).createDM()).send(
                    `Successfully created module to match users in your server. Matching won't occur until you make it active.`
                );
                logger.info(
                    `${NAMESPACE}.run: Guild (server) with dGuildId:${guild.id} match record created with status set to PAUSED.`,
                    {
                        guildId: guild.id
                    }
                );
            }
            // unsuccessfully created
            else {
                logger.error(
                    `${NAMESPACE}.run: Guild (server) with dGuildId:${guild.id} match record not created.`,
                    {
                        guildId: guild.id
                    }
                );
                (await (await guild.fetchOwner()).createDM()).send(
                    `xBot server config wasn't configured. Please login to your dashboard and configure the settings. xBot may not work well without this setup. Thank you. `
                );
            }
        } catch (error: any) {
            logger.error(
                `${NAMESPACE}.run: Guild (server) with dGuildId:${guild.id} config could not be created.`,
                {
                    guildId: guild.id,
                    errorMessage: error.message
                }
            );
            (await (await guild.fetchOwner()).createDM()).send(
                `xBot server config wasn't configured. Please login to your dashboard and configure the settings. xBot may not work well without this setup. Thank you. `
            );
            logger.error(
                `${NAMESPACE}.run: Sent DM to Owner of Guild (server) with dGuildId:${guild.id} DM about missing server config.`,
                {
                    guildId: guild.id,
                    ownerId: guild.ownerId
                }
            );
        }
    }
}
