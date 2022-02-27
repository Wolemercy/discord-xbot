import path from 'path';
import { promises as fs } from 'fs';
import DiscordClient from '../client/client';
import { PermissionResolvable } from 'discord.js';
import { RolePermission } from '../../@types/server';

const commandsArray = [];
export async function registerCommands(client: DiscordClient, dir: string = '') {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            const { default: Command } = await import(path.join(dir, file));
            const command = new Command();
            client.commands.set(command.getName(), command);
            command.getAliases().forEach((alias: string) => {
                client.commands.set(alias, command);
            });
            commandsArray.push(command);
        }
    }
}

export async function registerEvents(client: DiscordClient, dir: string = '') {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            const { default: Event } = await import(path.join(dir, file));
            const event = new Event();
            client.events.set(event.getName(), event);
            client.on(event.getName(), event.run.bind(event, client));
        }
    }
}

export async function registerPermissions(guildId: string, client: DiscordClient) {
    try {
        const tempGuild = await client.guilds.resolve(guildId);
        if (!tempGuild) {
            return;
        }
        const permissions: RolePermission[] = [];
        const fullPermissions: any[] = [];
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
            guildId: tempGuild.id
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
    } catch (error) {
        console.log(error);
    }
}
