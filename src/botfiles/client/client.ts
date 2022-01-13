import { Client, ClientOptions, Collection } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import BaseCommand from '../utils/structures/BaseCommand';
import { ServerSetting } from '../../@types/server';

export default class DiscordClient extends Client {
    private _commands = new Collection<string, BaseCommand>();
    private _events = new Collection<string, BaseEvent>();
    private _prefix: string = '!';
    private _configs = new Collection<string, ServerSetting>();

    constructor(options: ClientOptions) {
        super(options);
    }

    get commands(): Collection<string, BaseCommand> {
        return this._commands;
    }
    get events(): Collection<string, BaseEvent> {
        return this._events;
    }
    get prefix(): string {
        return this._prefix;
    }
    set prefix(prefix: string) {
        this._prefix = prefix;
    }

    get configs() {
        return this._configs;
    }
    set configs(guildConfigs: Collection<string, ServerSetting>) {
        this._configs = guildConfigs;
    }
}
