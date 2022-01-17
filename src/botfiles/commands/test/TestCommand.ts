import { CommandInteraction, Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class TestCommand extends BaseCommand {
    constructor() {
        super('test', 'testing', ['test']);
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Test command works');
    }
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply('test command works');
    }
}
