import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { db, cache } from '../../../app';

export default class GetAllMatchesCommand extends BaseCommand {
    constructor() {
        super('matchAll', 'match', ['match all']);
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Matche mee');
    }
}
