import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { db, cache } from '../../../app';
import logger from '../../../config/logger';
const { PAGINATION_COUNT } = process.env;

export default class GetUserMatchesCommand extends BaseCommand {
    constructor() {
        super(
            'matchUser',
            'match',
            ['matchuser'],
            `Returns a list of your last 20 historical matches.`
        );
    }

    getData() {
        return new SlashCommandBuilder()
            .setName(this.getName().toLowerCase())
            .setDescription(this.getDescription())
            .addNumberOption((option) =>
                option
                    .setName('page')
                    .setDescription(
                        'The number used to retrieve the next set of matches. Starts at 1.'
                    )
                    .setMinValue(1)
                    .setRequired(true)
            );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Matche mee');
    }
    async execute(interaction: CommandInteraction): Promise<void> {
        const cacheKey = `SUM-${interaction.user.id}`;
        try {
            const pageNo = interaction.options.getNumber('page');
            // retrieves user's historical matches from the cache
            let userMatches = await cache.lrange(cacheKey, 1, -1);
            let dbMatches;
            // if the matches don't exist in cache
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
                            }
                        }
                    }
                });
                if (dbMatches.length === 0) {
                    await interaction.reply(`Oops! You don't have any matches yet.`);
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
                .setTitle(`${interaction.user.username}'s last 20 matches.`)
                .setColor('BLUE');
            let returnedValue;
            if (pageNo === 1) {
                console.log('Isiisis', userMatches.length);
                returnedValue = userMatches.slice(0, Number(PAGINATION_COUNT));
            } else {
                returnedValue = userMatches.slice(
                    (Number(pageNo) - 1) * Number(PAGINATION_COUNT),
                    Number(pageNo) * Number(PAGINATION_COUNT)
                );
            }
            returnedValue = returnedValue.map((rv) => JSON.parse(rv));
            returnedValue.forEach((rv) => {
                embed.addField(`Matched on ${rv.matchDate}`, rv.name);
            });

            embed.setDescription(`
           A list of all your last 20 matches. ${
               Number(pageNo) * Number(PAGINATION_COUNT) < userMatches.length
                   ? `For next set of matches, call the command with ${pageNo! + 1} as page.`
                   : 'No Matches left.'
           }
            `);

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
