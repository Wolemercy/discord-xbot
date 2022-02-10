import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { db, cache } from '../../../config/storage';
import logger from '../../../config/logger';
import { Utils } from '../../../config/helpers';

const { POOL_EXPIRY_HOUR } = process.env;
export default class MatchAddCommand extends BaseCommand {
    constructor() {
        super('matchAdd', 'match', ['matchadd'], 'Adds you to the pool for pairing.');
    }

    getData() {
        return new SlashCommandBuilder()
            .setName(this.getName().toLowerCase())
            .setDescription(this.getDescription())
            .addStringOption((option) =>
                option
                    .setName('me')
                    .setDescription(
                        `Who should be added to the pool. Only accepts "me" as argument.`
                    )
                    .setRequired(true)
            );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Working');
    }
    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const candidate = interaction.options.getString('me');
            if (candidate !== 'me') {
                await interaction.reply(
                    `You slimmy sledupy slimmer 😡 ! I will only accept "me" as an argument. Without quote of course.`
                );
                return;
            }
            if (!interaction.guildId) {
                await interaction.reply(
                    "For some reason, you can't call this command at the moment."
                );
                logger.error(
                    `An error occured in the use of ${this.getName().toLowerCase()} COMMAND by User ${
                        interaction.user.id
                    }. guildId doesn't exist on interaction`
                );
                return;
            }
            const serverToBeMatched = await db.match.findFirst({
                where: {
                    dGuildId: {
                        equals: interaction.guildId
                    }
                }
            });
            if (serverToBeMatched) {
                const today = new Date();
                const theDay = Utils.formatDate(today);
                today.setDate(new Date().getDate() - 1);
                const nextMatchDate = Utils.formatDate(serverToBeMatched.nextMatchDate);
                serverToBeMatched.nextMatchDate.setDate(
                    serverToBeMatched.nextMatchDate.getDate() - 1
                );
                const aDayBeforeMatchDate = Utils.formatDate(
                    new Date(serverToBeMatched.nextMatchDate)
                );
                if (theDay === aDayBeforeMatchDate) {
                    if (today.getHours() >= Number(POOL_EXPIRY_HOUR)) {
                        await interaction.reply(
                            `Oops, the allowed time to enter the pool has expired. You missed this draft soldier 😭😭😭. Remember, missing more than 2 rounds is an offence punishable by kicking out 💣  ⚔️!`
                        );
                        logger.info(
                            `User ${
                                interaction.user.id
                            } used the ${this.getName().toLowerCase()} COMMAND. User:${
                                interaction.user.id
                            } missed matching pool of ${nextMatchDate}`
                        );
                        return;
                    } else {
                        const cacheKey = `SUMPOOL-${interaction.guildId}`;
                        await cache.sadd(cacheKey, interaction.user.id);
                        await interaction.reply(
                            `Dear soldier, you have successfully been added to this draft. Await further instructions 🪖 🎖️.`
                        );
                        logger.info(
                            `User ${
                                interaction.user.id
                            } successfully used the ${this.getName().toLowerCase()} COMMAND`
                        );
                        return;
                    }
                } else {
                    await interaction.reply(
                        `Dear soldier, it's not draft date yet. Be patient 😌. Run "/matchactive" to get your active matches. `
                    );
                    return;
                }
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
