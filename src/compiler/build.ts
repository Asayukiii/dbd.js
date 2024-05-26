import { EmbedBuilder, MessageCreateOptions, Message, ButtonInteraction, CommandInteraction, MessageComponentInteraction, StringSelectMenuInteraction, User, GuildMember, Guild, TextChannel, DMChannel, Client, NewsChannel } from 'discord.js';
import { CompilerPlugin } from '../handlers/plugin';
import { InterpreterResult } from './interpreter';
import { Command } from '../handlers/managers';
import Debugger from '../handlers/debugger';
import Util from '../handlers/util';
import Main from '../main/main';

/**
 * Function parameters information.
 */
export interface UnpackInformation {
    total: string;
    inside: string;
    splits: string[];
}

/**
 * Run-time data extra information.
 */
export interface InstanceDataExtra {
    author?: User;
    member?: GuildMember;
    message?: Message;
    guild?: Guild;
    channel?: DMChannel | TextChannel | NewsChannel;
    interaction?: ButtonInteraction | CommandInteraction | StringSelectMenuInteraction | MessageComponentInteraction;
    client: Client<true> & { dbdjsProgram: Main };
    bot: any;
    returnCode: boolean;
    command: Command;
    variables: any;
}

/**
 * Run-time data information.
 */
export interface InstanceData {
    start: number;
    httpResult: Response | null;
    onlyEdit?: boolean;
    editMessage?: Message;
    requestConfig: RequestInit;
    ignoreErrors: boolean;
    errorMessage: Error | null;
    suppressed: Error | null;
    suppressedMessage: [string, any];
    splits: string[];
    code: string;
    data: InstanceDataExtra;
    strictErrors: boolean;
    sendOptions: MessageCreateOptions;
    unpacked: string;
    embeds: EmbedBuilder[];
    errorWasClient: boolean;
    wasUnpacked: boolean;
    util: typeof Util;
    useEphemeral: boolean;
    unpack: (string: string) => UnpackInformation;
    createEmbed: () => void;
    getEmbed: (index?: number) => EmbedBuilder;
    hasUsage: () => boolean;
    error: (error: string, onlyIfStrict?: boolean) => void;
}

async function build(d: InterpreterResult, _: any): Promise<{
    result: any;
    leftover: InstanceData;
}> {
    const InstanceData: InstanceData = {
        start: Date.now(),
        httpResult: null,
        requestConfig: {
            headers: {},
        },
        ignoreErrors: false,
        errorMessage: null,
        suppressed: null,
        suppressedMessage: ["", {}],
        splits: [],
        code: "",
        data: {
            returnCode: false,
            variables: {},
            ..._
        },
        strictErrors: false,
        sendOptions: {},
        unpacked: "",
        embeds: [],
        wasUnpacked: false,
        unpack: (string) => {
            // @ts-ignore
            let _this = this;
            if (!_this?.start)
                _this = InstanceData;
            if (string.length)
                _this.wasUnpacked = true;
            return {
                total: string,
                inside: string.slice(1, string.length - 1),
                splits: string.slice(1, string.length - 1).split(/[;]/g)
            };
        },
        createEmbed: () => {
            // @ts-ignore
            let _this = this;
            if (!_this?.start)
                _this = InstanceData;
            _this.embeds.push(new EmbedBuilder());
        },
        getEmbed: (index = 0) => {
            // @ts-ignore
            let _this = this;
            if (!_this?.start)
                _this = InstanceData;
            const embed = _this.embeds[index];
            if (!embed) {
                const newEmbed = new EmbedBuilder();
                _this.embeds[index] = newEmbed;
                return newEmbed;
            }
            return embed;
        },
        hasUsage: () => {
            // @ts-ignore
            let _this = this;
            if (!_this?.start)
                _this = InstanceData;
            if (_this.unpacked)
                return true;
            return false;
        },
        error: function (error, onlyIfStrict) {
            // @ts-ignore
            let _this = this;
            if (!_this?.start)
                _this = InstanceData;
            const errorMessage = new Error(error);
            if (_this.ignoreErrors)
                return;
            if (onlyIfStrict && _this.strictErrors) {
                _this.errorMessage = errorMessage;
                return;
            }
            _this.errorMessage = errorMessage;
        },
        util: Util,
        errorWasClient: false,
        useEphemeral: false
    }
    
    async function walk(data: any) {
        let code = data.code;
        for (const v of data.functions) {
            if (InstanceData.errorMessage)
                break;
            /**
             * @type {String}
             */
            let F = v.shift();
            const V = v.shift();
            const isPlugin = CompilerPlugin.manager.array().find(f => f.identifier === F);
            const File = isPlugin ? isPlugin.callback : Util.requireModule("../Functions/" + F.slice(1) + ".js");
            // Replace function to correct lowercase and uppercase
            code = code.replace(new RegExp("\\" + F, "i"), F);
            if (isPlugin && V) {
                InstanceData.unpacked = !isPlugin?.compileUnpacked ? V?.code : await walk(V);
                code = code.replace(F + "[", F + InstanceData.unpacked);
            }
            else if (!isPlugin && V) {
                InstanceData.unpacked = await walk(V);
                code = code.replace(F + "[", F + InstanceData.unpacked);
            }
            if (InstanceData.errorMessage)
                break;
            let output = File(InstanceData);
            if (output && typeof output.then === "function")
                output = await output;
            if (InstanceData.wasUnpacked)
                F = F + InstanceData.unpacked;
            code = code.replace(F, String(output || (typeof output !== "string" ? F : "")));
            InstanceData.unpacked = "";
            InstanceData.wasUnpacked = false;
            if (InstanceData.errorMessage !== null) {
                if (!InstanceData.errorWasClient) {
                    (InstanceData.errorMessage as Error).message = `\`\`\`js\n${F} Compiler ran to ${(InstanceData.errorMessage as Error).stack?.replace("Script._compile", "ScriptCodeCompiler")}\`\`\``;
                    Debugger.log(`Changed Error Message by '${F}'`, Debugger.FLAGS.INFO);
                } else {
                    Debugger.log((InstanceData.errorMessage as Error).message, Debugger.FLAGS.WARN);
                }
                break;
            }
        }
        return code
    }
    
    return { result: await walk(d), leftover: InstanceData }
}

export default build;