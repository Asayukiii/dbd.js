import { DMChannel, TextChannel, NewsChannel, MessageCreateOptions, Message } from "discord.js";
import Debugger from "../handlers/debugger";
import { InstanceData } from "./build";

function resolveMessage(channel: DMChannel | TextChannel | NewsChannel, options: MessageCreateOptions, instancedata: InstanceData): TypeError | Promise<void | Message> {
    if (!channel || typeof channel.send !== "function")
        return new TypeError();
    if (instancedata.editMessage) {
        const m = instancedata.editMessage;
        m.edit({
            content: m.content || undefined,
            embeds: m.embeds,
            components: m.components
        });
    }
    return channel.send({ ...options }).catch(err => Debugger.log(err.message, Debugger.FLAGS.ERROR))
}

export default resolveMessage;