import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
export default class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready');
    }
    async run(client: DiscordClient) {
        try {
            console.log('Bot has logged in.');
            // const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);
            // const commands = client.commands.map((cmd) =>
            //     new SlashCommandBuilder()
            //         .setName(cmd.getName())
            //         .setDescription(cmd.getDescription())
            //         .toJSON()
            // );
            // await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            //     body: commands
            // });

            // console.log('Successfully reloaded application (/) commands.');
        } catch (err) {
            console.log(err);
        }
    }
}
