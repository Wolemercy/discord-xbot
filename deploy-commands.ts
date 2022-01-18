require('dotenv').config();
const path = require('path');
const { promises: fs } = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
console.log({ BOT_TOKEN, CLIENT_ID, GUILD_ID });
let commands: any = [];
const extractCommands = async (dir = '/src/botfiles/commands') => {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);

    for (const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory()) {
            await extractCommands(path.join(dir, file));
        }
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            const { default: Command } = await import(path.join(__dirname, dir, file));
            const command = new Command();
            commands.push(command.getData().toJSON());
        }
    }
};

(async () => {
    try {
        await extractCommands();
    } catch (error) {
        console.error(error);
    } finally {
        try {
            console.log('Started refreshing application (/) commands.', commands);
            const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                body: commands
            });

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }
})();
