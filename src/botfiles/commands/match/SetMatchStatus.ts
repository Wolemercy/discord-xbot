import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { db, cache } from '../../../config/storage';
import logger from '../../../config/logger';
import { Utils } from '../../../config/helpers';

const { POOL_EXPIRY_HOUR } = process.env;
export default class SetMatchStatus extends BaseCommand {
    constructor() {
        super('setMatchStatus', 'match', ['setmatchstatus'], 'Sets the status of a match.');
    }

    getData() {
        return new SlashCommandBuilder()
            .setName(this.getName().toLowerCase())
            .setDescription(this.getDescription())
            .addStringOption((option) =>
                option.addChoices([
                    ['status', 'Active'],
                    ['status', 'Paused']
                ])
            )
            .setDefaultPermission(false);
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Working');
    }
    async execute(interaction: CommandInteraction): Promise<void> {
        try {
        } catch (error: any) {
            console.log(error);
            logger.error(
                `An error occured in the use of ${this.getName().toLowerCase()} COMMAND by User ${
                    interaction.user.id
                }:`,
                error
            );
            throw new Error(error.message);
        }
    }
}
