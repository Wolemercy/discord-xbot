import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionResolvable, ApplicationCommandPermissionData } from 'discord.js';
import logger from '../../../config/logger';
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
            const permissions: RolePermission[] = [];
            const fullPermissions: any[] = [];
            guilds.forEach(async (guild) => {
                const tempGuild = await guild.fetch();
                client.commands.forEach(async (command) => {
                    if (command.getPermissions().length === 0) return;
                    const roles = tempGuild.roles.cache.filter((r) =>
                        r.permissions.has(command.getPermissions() as PermissionResolvable)
                    );

                    roles.forEach((r) => {
                        permissions.push({
                            id: r.id,
                            type: 'ROLE',
                            permission: true
                        });
                    });
                });
                const commands = await client.application?.commands.fetch({
                    guildId: guild.id
                });

                commands?.forEach(async (cmd) => {
                    const tempCommand = client.commands.get(cmd.name);

                    if (tempCommand && tempCommand.getPermissions().length != 0) {
                        fullPermissions.push({
                            id: cmd.id,
                            permissions: [...permissions]
                        });
                    }
                });

                await tempGuild.commands.permissions.set({
                    fullPermissions
                });
            });
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
