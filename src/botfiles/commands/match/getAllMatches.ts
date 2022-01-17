import { CommandInteraction, Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { db, cache } from '../../../app';

export default class GetAllMatchesCommand extends BaseCommand {
    constructor() {
        super('matchAll', 'match', ['matchall']);
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Matche mee');
    }
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply('test command works');
    }
}
