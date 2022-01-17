import BaseEvent from '../../utils/structures/BaseEvent';
import { Message } from 'discord.js';
import DiscordClient from '../../client/client';
import { cache } from '../../../app';
import { ServerSetting } from '@prisma/client';
export default class MessageEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }

    async run(client: DiscordClient, message: Message) {
        if (message.author.bot) return;
        if (message.interaction?.type === 'APPLICATION_COMMAND') {
            console.log('I logged');
        }
        let config = (await cache.get(message.guildId!)) as any;
        if (!config) {
            message.channel.send(
                'No configuration set. Please visit the dashboard and configure your bot settings.'
            );
            return;
        }
        config = JSON.parse(config) as ServerSetting;
        if (message.content.startsWith(config.botCommandPrefix)) {
            const [cmdName, ...cmdArgs] = message.content
                .slice(config.botCommandPrefix.length)
                .trim()
                .split(/\s+/);
            console.log(cmdName);
            const command = client.commands.get(cmdName);
            if (command) {
                command.run(client, message, cmdArgs);
            }
        }
    }
}
