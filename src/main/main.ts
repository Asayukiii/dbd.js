import { Command, StatusManager, CommandManager, Managers } from '../handlers/managers';
import { Events as ClientEvents, EventResolvable, AlphaTypes as Types } from './types';
import build, { InstanceData } from '../compiler/build';
import resolveMessage from '../compiler/resolveMessage';
import Interpreter from '../compiler/interpreter';
import StatusHandler from '../handlers/status';
import Debugger from '../handlers/debugger';
import * as Discord from 'discord.js';
import Util from '../handlers/util';
import Config from './config';

const Events = Object.values(Types)

export interface ClientOptions {
    useInternalSharding: boolean;
    shardCount: number;
    // danbotHostingKey: string;
    mobilePresence: boolean;
    ignoreDMs: boolean;
    ignoreMe: boolean;
    ignoreBots: boolean;
    intents: Discord.GatewayIntentsString;
    // database?: Database;
    prefix: string[];
    cache: Discord.CacheFactory;
    reverseReading: boolean;
}

export interface ActivityOptions {
    /** The activity to display in User Presence */
    activity: string;
    /** Type of activity in User Presence */
    type?: Discord.ActivityType;
    /** Lifetime for an activity to be displayed in User Presence */
    time: 10 | number;
    /** Compiles activity / Designates activity as a code */
    compileCode?: boolean;
    /** Type of status for User Presence should use */
    status?: Discord.PresenceStatusData;
    /** URL Stream that should be provided */
    url?: string;
}

function runEvent(event: string) {
    return Util.requireModule("../Events/" + event + ".js");
}

class Main {
    client: any;
    // database: Database;
    commands: CommandManager;
    status: StatusManager;
    constructor(clientOptions: ClientOptions) {
        this.commands = Managers.Command
        this.status = Managers.Status
        Config.Options = clientOptions
        Config.ClientOptions = {
            intents: Config.Options.intents,
            makeCache: Config.Options.cache
        }
        if (Array.isArray(Config.Options.prefix))
            Config.CommandPrefix = clientOptions.prefix;
        if (typeof Config.Options.prefix === "string") {
            const _string = Config.Options.prefix;
            Config.CommandPrefix.push(_string);
        }
        if (!Config.CommandPrefix.length)
            throw new Error("Mismatch of prefix Type / No prefix was present or set");
        this.client = new Discord.Client(Config.ClientOptions);
        this.client.dbdjsProgram = this;
        this.client.once("ready", function (client: Main['client']) {
            StatusHandler(Config.Statuses, client.dbdjsProgram);
        });
    }
    
    /**
     * Enable Discord.js event
     * @param event
     */
    enableEvents(...events: EventResolvable<ClientEvents>[]) {
        const evs = Util.iterateArgs(events);
        for (const event of evs) {
            if (!Events.includes(event as any))
                throw new TypeError(`Unsupported event of "${event}"!`);
            this.client.on(event, runEvent(event as string));
        }
    }
    
    /**
     * Register commands to an event
     * @param event
     * @param command
     */
    registerCommands(event: EventResolvable<ClientEvents>, ...commands: Command[]) {
        if (!Events.includes(event as any))
            throw new TypeError(`Unsupported event of "${event}"!`);
        if (!this.client.eventNames().includes(event))
            throw new Error(`Event named "${event}" is not enabled, please enabled first!`);
        const cmds = Util.iterateArgs(commands);
        for (const command of cmds) {
            if (!("code" in command) || !command.code)
                throw new Error("Command code is required!");
            Config.Commands.set("C-" + event + "-" + Config.Commands.size.toString(), command);
        }
    }
    
    /**
     * Starts the package and initialize discord bot with provided token
     * @param token - Discord Bot Token
     */
    login(token: string) {
        return this.client.login(token);
    }
    
    /**
     * Adds an activity to bot status
     */
    addActivity(...options: ActivityOptions[]) {
        const opts = Util.iterateArgs(options);
        for (const activity of opts) {
            Config.Statuses.set("ST-" + Config.Statuses.size.toString(), {
                name: activity.activity,
                type: activity.type,
                Lifetime: activity.time,
                url: activity.url,
                status: activity.status!.toLowerCase(),
                compile: Main._compile
            });
        }
    }
    
    static async _compile(command: Command, data: any): Promise<void | TypeError | Discord.Message | {
        result: any;
        leftover: InstanceData;
    }> {
        Debugger.log(`Task Compiler Running`, Debugger.FLAGS.INFO);
        const output = await build(Interpreter(command.code, Config.Options.reverseReading), { command, ...data });
        let error = {} as any;
        if (data.returnCode)
            return output;
        if (output.leftover.errorMessage && !output.leftover.ignoreErrors)
            error = output.leftover.errorMessage;
        if (output.leftover.suppressed) {
            if (output.leftover.suppressedMessage)
                error = output.leftover.suppressedMessage;
            else
                error = new Error("");
        }
        //if (error instanceof Error) error = await resolveError(error, this, output.leftover.data.message) || {};
        const body = {
            embeds: output.leftover.embeds,
            ephemeral: output.leftover.useEphemeral,
            ...output.leftover.sendOptions
        };
        if (error.message || output.result)
            body.content = error.message || output.result;
        if (output.leftover.data.interaction) return output.leftover.data.interaction.reply(body as any);
        return resolveMessage(output.leftover.data.channel!, body, output.leftover);
    }
}

export default Main;