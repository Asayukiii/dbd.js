import { ClientOptions as DiscordClientOptions } from 'discord.js';
import { Command } from '../handlers/managers';
import { Collection } from '../handlers/util';
import { Status } from '../handlers/status';
import { ClientOptions } from './main';

class Config {
    static Statuses = new Collection<string, Status>()
    static Commands = new Collection<string, Command>()
    static ClientOptions = {} as DiscordClientOptions
    static CommandPrefix: string[] = []
    static Options = {} as ClientOptions
    static CaseSensitiveTrigger = false
    static _firstModified = false;
    static checkUpAsModified() {
        if (Config._firstModified) return false;
        Config._firstModified = true;
        return true;
    }
}

export default Config;