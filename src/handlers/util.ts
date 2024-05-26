// @ts-nocheck
import { Client, Channel, User, Guild } from "discord.js";
import { InstanceDataExtra } from "../compiler/build";

export class Collection<K, V> extends Map {
    add(...args: V[]) {
        for (const arg of args)
            this.set(this.size, arg);
    }
    
    push(...args: V[]) {
        for (const arg of args)
            this.set(this.size, arg);
    }
    
    array() {
        return Array.from<V>(this.values());
    };
}

/** An Utility object that handles most annoying part's */
/*declare namespace Util {
    function iterateArgs<T>(args: T[]): T[];
    function removeItemFromArray<T>(arr: Array<T>, value: T): Array<T>;
    function requireModule(id: string): any;
    function escape(string: string): string;
    function unescape(string: string): string;
    function findInfoFromPackets(data: InstanceDataExtra, target: string): any;
    function getGuildsCache(client: Client): Promise<Guild[]>;
    function getChannelsCache(client: Client): Promise<Channel[]>;
    function getUsersCache(client: Client): Promise<User[]>;
    function getUser(client: Client, Id: `${bigint}`): Promise<User>;
    function getChannel(client: Client, Id: `${bigint}`): Promise<Channel>;
    function getGuild(client: Client, Id: `${bigint}`): Promise<Guild>;
    function createShardingManager(file: string, token: string, dbhKey: string): ShardingManager;
    function checkCondition(str: string): boolean;
    function msParser(string: string): any;
}*/

/** An Utility object that handles most annoying part's */
class Util {
    static iterateArgs<T>(args: T[]) {
        let iteratedArgs: T[] = [];
        for (const v of args) {
            if (Array.isArray(v)) {
                iteratedArgs = iteratedArgs.concat(v);
            }
            else {
                iteratedArgs.push(v);
            }
        }
        return iteratedArgs;
    }

    static removeItemFromArray<T>(arr: Array<T>, value: T) {
        const index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    static requireModule(id: string) {
        const module = require(id);
        if (module.default)
            return module.default;
        return module;
    }

    static escape(text: string) {
        return text
            .replace('[', '%OP_1%')
            .replace(']', '%OP_2%')
            .replace(';', '%SEP_TR%');
    }

    static unescape(text: string) {
        return text
            .replace('%OP_1%', '[')
            .replace('%OP_2%', ']')
            .replace('%SEP_TR%', ';');
    }

    static findInfoFromPackets(data: InstanceDataExtra, target: string) {
        // @ts-ignore
        const result = data[target] || data.channel?.[target] || data.member?.[target] || data.message?.[target] || data.interaction?.[target];
        if (target === 'guild' && result) {
            if (!result.available)
                return Util.getGuild(result.id);
            return result;
        }
    }

    static async getGuildsCache(client: Client<true>) {
        const shard = client.shard;
        if (shard !== null) {
            const shardResponse = await shard.fetchClientValues("guilds.cache");
            return shardResponse.reduce((p, value) => {
                p = p.concat(Array.from(value.values()));
                return p;
            }, []) as Guild[];
        } else {
            return Array.from(client.guilds.cache.values());
        }
    }

    static async getChannelsCache(client: Client<true>): Promise<Channel[]> {
        const shard = client.shard;
        if (shard !== null) {
            const shardResponse = await shard.fetchClientValues("channels.cache");
            return shardResponse.reduce((p, value) => {
                p = p.concat(Array.from(value.values()));
                return p;
            }, []) as Channel[];
        } else {
            return Array.from(client.channels.cache.values());
        }
    }

    static async getUsersCache(client: Client): Promise<User[]> {
        const shard = client.shard;
        if (shard !== null) {
            const shardResponse = await shard.fetchClientValues("users.cache");
            return shardResponse.reduce((p, value) => {
                p = p.concat(Array.from(value.values()));
                return p;
            }, []) as User[];
        } else {
            return Array.from(client.users.cache.values());
        }
    }

    static async getUser(client: Client, Id: `${bigint}`): Promise<User> {
        const shard = client.shard;
        if (shard) {
            const shardCache = client.users.cache;
            if (shardCache.has(Id))
                return shardCache.get(Id);
            const allCache = (await shard.fetchClientValues('users.cache')).reduce((acc, g) => acc.concat(Array.from(g.values())), []);
            const user = allCache.find((user) => user.id === Id);
            if (user)
                return user;
            const fetch = await client.users.fetch(Id).catch(_ => null);
            return fetch;
        } else {
            const user = client.users.cache.get(Id);
            if (user)
                return user;
            return await client.users.fetch(Id).catch(_ => null);
        }
    }
    
    static async getChannel(client: Client, Id: `${bigint}`): Promise<Channel> {
        const shard = client.shard;
        if (shard) {
            const shardCache = client.channels.cache;
            if (shardCache.has(Id))
                return shardCache.get(Id);
            const allCache = (await shard.fetchClientValues('channels.cache')).reduce((acc, g) => acc.concat(Array.from(g.values())), []);
            const channel = allCache.find((channel) => channel.id === Id);
            if (channel)
                return channel;
            const fetch = await client.channels.fetch(Id).catch(_ => null);
            return fetch;
        } else {
            const channel = client.channels.cache.get(Id);
            if (channel)
                return channel;
            return await client.channels.fetch(Id).catch(_ => null);
        }
    }
    
    static async getGuild(client: Client, Id: `${bigint}`): Promise<Guild> {
        const shard = client.shard;
        if (shard) {
            const shardCache = client.guilds.cache;
            // See if Shard has Guild
            if (shardCache.has(Id))
                return shardCache.get(Id);
            const allCache = (await shard.fetchClientValues('guilds.cache')).reduce((acc, g) => acc.concat(Array.from(g.values())), []);
            const guild = allCache.find((guild) => guild.id === Id);
            // See if Shards cache has Guild
            if (guild)
                return guild;
            const fetch = await client.guilds.fetch(Id).catch(_ => null);
            // Fetched Guild if no shard has cache of Guild Id
            return fetch;
        } else {
            const guild = client.guilds.cache.get(Id);
            if (guild)
                return guild;
            return await client.guilds.fetch(Id).catch(_ => null);
        }
    }
    
    static checkCondition(str: string): boolean {
        const operators = () => {
            for (const op of ["<=", ">=", "==", "!=", "<", ">"]) {
                if (str.includes(op))
                    return op;
            }
        };
        // Getting Operator
        const op = operators();
        // Define Conditions
        const c = str.split(op), c1 = c[0], c2 = c[1], c1N = Number(c1), c2N = Number(c2);
        // Handle Conditions with Operator
        // Condition must be the exact same
        if (op === "==" && c1 === c2)
            return true;
        // Condition must not be same
        else if (op === "!=" && c1 !== c2)
            return true;
        // Condition is bigger than target
        else if (op === ">") {
            // Handle this operator in a new scope
            // if conditions are number
            if (!isNaN(c1N) && !isNaN(c2N) && c1N > c2N)
                return true;
            // else count length of condition string 
            else if (c1.length > c2.length)
                return true;
            // if those are incorrect / below, return false
            else
                return false;
        }
        // Condition is smaller than target 
        else if (op === "<") {
            // Handle this operator in a new scope
            // if conditions are number
            if (!isNaN(c1N) && !isNaN(c2N) && c1N < c2N)
                return true;
            // else count length of condition string 
            else if (c1.length < c2.length)
                return true;
            // if those are incorrect / below, return false
            else
                return false;
        }
        // Condition is bigger or same as target
        else if (op === ">=") {
            // Handle this operator in a new scope
            // if conditions are number
            if (!isNaN(c1N) && !isNaN(c2N) && c1N >= c2N)
                return true;
            // else count length of condition string 
            else if (c1.length >= c2.length)
                return true;
            // if those are incorrect / below, return false
            else
                return false;
        }
        // Condition is smaller or same as target
        else if (op === "<=") {
            // Handle this operator in a new scope
            // if conditions are number
            if (!isNaN(c1N) && !isNaN(c2N) && c1N <= c2N)
                return true;
            // else count length of condition string 
            else if (c1.length <= c2.length)
                return true;
            // if those are incorrect / below, return false
            else
                return false;
        }
        // If no operator were present but the whole condition are boolean
        else if (!op && str.toLowerCase() === "true")
            return true;
        // If all of them are incorrect
        return false;
    }
    
    static msParser(text: string) {
        if (typeof text !== "string")
            return 0;
        let ms = 0;
        const ar = text.split(/(\D)/g);
        let op = ["s", "m", "h", "d", "M", "y"];
        let intVal = 0;
        let err = null;
        for (const v of ar) {
            if (!isNaN(Number(v))) {
                intVal = parseInt(v);
            }
            else if (op.includes(v)) {
                if (!intVal) {
                    err = new Error("Unexpected Identifier to be present before number!");
                    break;
                }
                if (v === "s")
                    ms += intVal;
                if (v === "m")
                    ms += intVal * 60;
                if (v === "h")
                    ms += intVal * 60 * 60;
                if (v === "d")
                    ms += intVal * 60 * 60 * 24;
                if (v === "M")
                    ms += intVal * 60 * 60 * 24 * 30;
                if (v === "y")
                    ms += intVal * 60 * 60 * 24 * 30 * 12;
                intVal = 0;
            }
            else {
                err = new Error("Invalid Identifier of '" + v + "' present in string!");
                break;
            }
        }
        if (err) return err;
        return ms * 1000;
    };
}

export default Util;