import { Request, Response, NextFunction } from 'express';
import { cache, db } from '../../config/storage';
import { APIError, UnauthorizedError } from '../../config/error';
import SessionConfig from '../../config/session';
import logger from '../../config/logger';
import { Utils } from '../../config/helpers';
import client from '../../botfiles/client';
import { MessageEmbed, TextChannel } from 'discord.js';

const NAMESPACE = 'BOTCONTROLLER';
// FIXME: THIS FIELD SHOULD BE ACCESSED FROM THE MATCH RESPONSE
const MATCHCHANNELID = '931198576984469548';

class BOTController {
    async matchResponder(req: Request, res: Response, next: NextFunction) {
        const { id } = req.body;

        if (!id) {
            logger.error(
                `Namespace:[${NAMESPACE}.matchResponder]: No ID field provided in request body.`
            );
        } else {
            const serverMatched = await db.match.findFirst({
                where: {
                    dGuildId: String(id)
                }
            });

            if (!serverMatched) {
                logger.error(
                    `Namespace:[${NAMESPACE}.matchResponder]: No match found for serverId ${id} in match table.`
                );
            } else {
                const channel = (await client.channels.fetch(
                    serverMatched.matchChannelId
                )) as TextChannel;
                const embed = new MessageEmbed()
                    .setTitle(`New learning matches.`)
                    .setColor('RANDOM')
                    .setDescription(
                        `A list of all new matches. Please run /matchactive to see your partner(s) grouped.`
                    );

                const dbActiveMatches = await db.serverUserMatch.findMany({
                    where: {
                        AND: {
                            dGuildId: {
                                equals: String(id)
                            },
                            isMatchActive: {
                                equals: true
                            }
                        }
                    }
                });
                if (!dbActiveMatches) {
                    logger.error(
                        `Namespace:[${NAMESPACE}.matchResponder]: Couldn't find active matches for this guild with id ${id}.`
                    );
                } else {
                    const guildsFetch = await client.guilds.resolve(id);

                    if (!guildsFetch) {
                        logger.error(
                            `Namespace:[${NAMESPACE}.matchResponder]: Couldn't fetch this guild with id ${id}.`
                        );
                    } else {
                        const guildMembersFetch = await guildsFetch.members.fetch();
                        if (!guildMembersFetch) {
                            logger.error(
                                `Namespace:[${NAMESPACE}.matchResponder]: Couldn't fetch this guild members with id ${id}.`
                            );
                        } else {
                            for (const userMatch of dbActiveMatches) {
                                const candidate = guildMembersFetch.get(userMatch.dUserId);
                                const matchedUser = guildMembersFetch.get(userMatch.dUserMatchedId);
                                embed.addField(
                                    `${candidate?.user.username} matched with ⬇️`,
                                    `${matchedUser?.user.username}`
                                );
                            }

                            await channel.send({
                                embeds: [embed]
                            });
                        }
                    }
                }
            }
        }

        return res.sendStatus(200);
    }
}

const botController = new BOTController();

export default botController;
