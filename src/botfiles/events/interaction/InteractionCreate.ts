import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import { Interaction } from 'discord.js';

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('interactionCreate');
    }
    async run(client: DiscordClient, interaction: Interaction) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }
    }
}
