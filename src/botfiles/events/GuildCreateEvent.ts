// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
import { Guild } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { db, cache } from '../../config/storage';
import logger from '../../config/logger';

const NAMESPACE = 'GuildCreateEvent';
export default class GuildCreateEvent extends BaseEvent {
    constructor() {
        super('guildCreate');
    }

    async run(client: DiscordClient, guild: Guild) {
        logger.info(`xBot Joined ${guild.name} guild`);

        try {
            let serverConfig = (await cache.get(guild.id)) as any;
            if (!serverConfig) {
                logger.info(
                    `${NAMESPACE}.run: Guild (server) with dGuildId:${guild.id} config not found in cache.`,
                    {
                        guildId: guild.id
                    }
                );
                let server = await db.server.findFirst({
                    where: {
                        dGuildId: guild.id
                    }
                });

                if (!server) {
                    logger.info(
                        `${NAMESPACE}.run: New guild (server) with dGuildId:${guild.id} added xBot.`,
                        {
                            guildId: guild.id
                        }
                    );
                    logger.info(
                        `${NAMESPACE}.run: Adding record in DB for new guild (server) with dGuildId:${guild.id}.`,
                        {
                            guildId: guild.id
                        }
                    );
                    server = await db.server.create({
                        data: {
                            dGuildId: guild.id,
                            dOwnerId: guild.ownerId,
                            name: guild.name
                        }
                    });
                    logger.info(
                        `${NAMESPACE}.run: New guild (server) with dGuildId:${guild.id} added to db.`,
                        {
                            guildId: guild.id
                        }
                    );
                    logger.info(
                        `${NAMESPACE}.run: New guild (server) config with dGuildId:${guild.id} added to db.`,
                        {
                            guildId: guild.id
                        }
                    );
                }

                serverConfig = await db.serverSetting.create({
                    data: {
                        dGuildId: server.dGuildId
                    }
                });

                await cache.set(guild.id, JSON.stringify(serverConfig));
                logger.info(
                    `${NAMESPACE}.run: New guild (server) config with dGuildId:${guild.id} added to cache.`,
                    {
                        guildId: guild.id
                    }
                );
            }
            logger.info(
                `${NAMESPACE}.run: Guild (server) with dGuildId:${guild.id} config found in cache.`,
                {
                    guildId: guild.id
                }
            );
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
