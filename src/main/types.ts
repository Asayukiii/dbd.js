import { RecursiveReadonlyArray } from "discord.js";

export enum AlphaTypes {
    Message = "messageCreate",
    MemberJoin = "guildMemberAdd",
    MemberLeave = "guildMemberRemove",
    MessageDelete = "messageDelete",
    Ready = "ready",
    InteractionCreate = "interactionCreate",
    BotJoinGuild = "guildCreate",
    BotLeaveGuild = "guildDelete"
}

export type Events = "messageCreate" | "guildMemberAdd" | "guildMemberRemove" | "messageDelete" | "ready" | "interactionCreate" | "guildCreate" | "guildDelete";

export type EventResolvable<T> = RecursiveReadonlyArray<T> | T;