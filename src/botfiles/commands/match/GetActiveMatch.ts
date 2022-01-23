import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { db, cache } from '../../../app';
import logger from '../../../config/logger';

export default class GetActiveMatchCommand extends BaseCommand {
    constructor() {
        super('matchActive', 'match', ['matchactive'], 'Returns your most recent active match');
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
        const cacheKey = `SAUM-${interaction.user.id}`;
        try {
            // retrieve user's active matches from the cache
            let userMatches = await cache.lrange(cacheKey, 1, -1);
            let dbMatches;
            // if matches do not exist in the cache
            if (userMatches.length === 0) {
                // retrieves it from db
                dbMatches = await db.serverUserMatch.findMany({
                    where: {
                        AND: {
                            dUserId: {
                                equals: interaction.user.id
                            },
                            dGuildId: {
                                equals: String(interaction.guildId)
                            },
                            isMatchActive: {
                                equals: true
                            }
                        }
                    }
                });
                if (dbMatches.length === 0) {
                    await interaction.reply(`Oops! You don't have an active match`);
                } else {
                    if (interaction.guild) {
                        const guildMembersFetch = await interaction.guild.members.fetch();
                        if (guildMembersFetch) {
                            userMatches = dbMatches.map((dbMatch) =>
                                JSON.stringify({
                                    name:
                                        guildMembersFetch.get(dbMatch.dUserMatchedId)?.user
                                            .username ?? 'A user has no name :)',
                                    dUserId: dbMatch.dUserId,
                                    matchDate: dbMatch.createdAt
                                })
                            );

                            await cache.rpush(cacheKey, '', ...userMatches);
                        }
                    }
                }
            }

            if (interaction.replied) {
                return;
            }
            const embed = new MessageEmbed()
                .setTitle(`${interaction.user.username}'s active matches`)
                .setColor('YELLOW');
            let returnedValue;
            returnedValue = userMatches.slice(0);
            returnedValue = returnedValue.map((rv) => JSON.parse(rv));
            returnedValue.forEach((rv) => {
                embed.addField(`Matched on ${rv.matchDate}`, rv.name);
            });

            embed.setDescription(`A list of all your current active matches`);

            await interaction.reply({
                embeds: [embed]
            });
            logger.info(
                `User ${
                    interaction.user.id
                } successfully used the ${this.getName().toLowerCase()} COMMAND`
            );
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
