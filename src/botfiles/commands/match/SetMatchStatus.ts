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
        super('setMatchStatus', 'match', ['setmatchstatus'], 'Sets the status of a match.', [
            'ADMINISTRATOR'
        ]);
    }

    getData() {
        return new SlashCommandBuilder()
            .setName(this.getName().toLowerCase())
            .setDescription(this.getDescription())
            .addStringOption((opt) =>
                opt
                    .setName('status')
                    .setDescription('Active | Pause')
                    .addChoice('active', 'active')
                    .addChoice('pause', 'pause')
                    .setRequired(true)
            )
            .setDefaultPermission(false);
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Working');
    }
    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const option = interaction.options.getString('status');
            const dbMatch = await db.match.findFirst({
                where: {
                    dGuildId: interaction.guildId!
                }
            });
            if (!dbMatch) {
                return await interaction.reply(
                    'Cannot find a match record for your server. Please contact the bot developer for assistance <sewb.dev@gmail.com>'
                );
            }
            if (dbMatch.status === 'PAUSED' && option === 'pause') {
                return await interaction.reply(
                    'This server has already paused matching. To activate matches, select active.'
                );
            } else {
                const inTwoDays = new Date(new Date().setDate(new Date().getDate() + 2));
                await db.match.update({
                    where: {
                        id: dbMatch.id
                    },
                    data: {
                        status: 'ACTIVE',
                        nextMatchDate: inTwoDays
                    }
                });

                logger.info(
                    `User ${
                        interaction.user.id
                    } successfully used the ${this.getName().toLowerCase()} COMMAND`
                );
                logger.info(
                    `User with id: ${
                        interaction.user.id
                    } has activated matching for guild with id ${
                        interaction.guildId
                    } on ${new Date().toDateString()}`
                );
                return await interaction.reply(
                    'You have successfully activated matching for this server. Pool entry will begin tomorrow and matching will occur after. Thank you. '
                );
            }
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
