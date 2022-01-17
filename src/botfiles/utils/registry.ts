import path from 'path';
import { promises as fs } from 'fs';
import DiscordClient from '../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

export async function registerCommands(client: DiscordClient, dir: string = '') {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    let commands = [];
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
            commands.push(
                new SlashCommandBuilder()
                    .setName(command.getName().toLowerCase())
                    .setDescription(command.getDescription())
            );
        }
    }

    commands = commands.map((cmd) => cmd.toJSON());
    console.log(commands);
    const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
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
