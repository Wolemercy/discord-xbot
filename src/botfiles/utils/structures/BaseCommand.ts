import { Interaction, Message } from 'discord.js';
import DiscordClient from '../../client/client';
import { SlashCommandBuilder } from '@discordjs/builders';

export default abstract class BaseCommand {
    constructor(
        private name: string,
        private category: string,
        private aliases: Array<string>,
        private description?: string
    ) {}

    getName(): string {
        return this.name;
    }
    getCategory(): string {
        return this.category;
    }
    getAliases(): Array<string> {
        return this.aliases;
    }
    getDescription(): string {
        return (
            this.description ||
            `A wonderful description for the command with name:${this.getName()}`
        );
    }

    getData(): any {
        return new SlashCommandBuilder()
            .setName(this.getName().toLowerCase())
            .setDescription(this.getDescription());
    }
    abstract run(
        client: DiscordClient,
        message: Message,
        args: Array<string> | null
    ): Promise<void>;
    abstract execute(interaction: Interaction): Promise<void>;
}
