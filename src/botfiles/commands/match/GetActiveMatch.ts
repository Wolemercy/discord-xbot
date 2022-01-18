import { CommandInteraction, Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { db, cache } from '../../../app';

export default class GetActiveMatchCommand extends BaseCommand {
    constructor() {
        super('matchActive', 'match', ['matchactive']);
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Toodles');
    }
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply('Toodles');
    }
}
