import { CommandInteraction, Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { db, cache } from '../../../app';

export default class GetActiveMatchCommand extends BaseCommand {
    constructor() {
        super('matchActive', 'match', ['matchactive']);
    }

    getData() {
        return new SlashCommandBuilder()
            .setName(this.getName().toLowerCase())
            .setDescription(this.getDescription());
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Toodles');
    }
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply('Toodles');
    }
}
