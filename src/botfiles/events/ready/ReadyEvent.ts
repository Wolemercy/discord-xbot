import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionResolvable, ApplicationCommandPermissionData } from 'discord.js';
import logger from '../../../config/logger';
import { registerPermissions } from '../../utils/registry';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

type RolePermission = {
    id: string;
    type: string;
    permission: boolean;
};
type fullPermission = {
    id: string;
    permissions: RolePermission[];
};
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
export default class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready');
    }
    async run(client: DiscordClient) {
        try {
            logger.info('Bot has logged in.');
            const guilds = await client.guilds.fetch();
            // const permissions: RolePermission[] = [];
            // const fullPermissions: any[] = [];
            guilds.forEach(async (guild) => {
                await registerPermissions(guild.id, client);
            });
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
