import { EventResolvable, Events, Alpha_Types as Types } from "../main/AlphaTypes";
import { ActivityOptions } from "../main/Main";
import Debugger from "./debugger";

const Events: Types[] = Object.values(Types);

export interface Command {
    name?: string;
    type?: EventResolvable<Events>;
    event?: EventResolvable<Events>;
    aliases?: string | string[];
    nonPrefix?: boolean;
    code: string;
}

export class CommandManager {
    add(...commands: Command[]) {
        const cmds = Util.iterateArgs(commands);
        for (const command of cmds) {
            if (!command.code)
                throw new Error("Invalid code, supplied string must be non-empty!");
            const event = command.type || command.event;
            if (Array.isArray(event)) {
                for (const ev of event) {
                    if (!ev || !Events.includes(ev)) {
                        throw new Error(`Invalid event of ${String(ev)}!`);
                    }
                    Config.Commands.set(`C-${Types[ev] || ev}-${Config.Commands.size}`, command);
                }
            } else {
                if (!event || !Events.includes(event)) {
                    throw new Error(`Invalid event of ${String(event)}!`);
                }
                Config.Commands.set(`C-${Types[event] || event}-${Config.Commands.size}`, command);
            }
        }
    };
    async load(path: string, debug?: boolean) {
        const doDebug = (message, method = Debugger.FLAGS.INFO) => Debugger.log(message, method);
        const queue = [path];
        function walk(path) {
            return new Promise(resolve => {
                fs.stat(path, (err, stat) => {
                    if (err && debug) {
                        return doDebug("> Encountered Error while walking " + path, Debugger.FLAGS.ERROR);
                    }
                    doDebug("> Walking " + path);
                    if (stat.isDirectory()) {
                        fs.readdir(path, (err, files) => {
                            if (err && debug) {
                                return doDebug("> Encountered Error while walking to path", Debugger.FLAGS.ERROR);
                            }
                            doDebug("> Confirmed AS Directory");
                            for (const name of files) {
                                queue.push(path + "/" + name);
                            }
                            resolve('');
                        });
                    }
                    else if (stat.isFile()) {
                        if (!path.endsWith(".js")) {
                            if (debug) {
                                resolve(doDebug("> Ignoring AS File", Debugger.FLAGS.WARN));
                            }
                            return;
                        }
                        const module = Util.requireModule(path);
                        try {
                            Managers.Command.add(module);
                            resolve(doDebug('> File Loaded Successfully'));
                        }
                        catch {
                            resolve(doDebug('> Exceptions when loading commands in file', Debugger.FLAGS.WARN));
                        }
                    }
                    else {
                        resolve(doDebug("> Unknown kind of Type " + path, Debugger.FLAGS.UNEXPECTED));
                    }
                });
            });
        }
        if (debug) {
            const stack = new Error().stack;
            const origin = stack?.split('\n')[1].trim();
            doDebug('=> "Load" Stack Start');
            doDebug('> From ' + origin);
        }
        while (queue.length > 0) {
            const shifted = queue.shift();
            await walk(shifted);
            if (queue.length < 1) {
                doDebug('=> "Load" Stack End');
            }
        }
    }
}

export class StatusManager {
    add(...activities: ActivityOptions[]) {
        const acts = Util.iterateArgs(activities);
        for (const activity of acts) {
            Config.Statuses.set("ST-" + Config.Statuses.size.toString(), {
                name: activity.activity,
                type: activity.type,
                Lifetime: activity.time,
                url: activity.url,
                status: activity.status.toLowerCase(),
                compile: Main._compile
            });
        }
    };
}

export class Managers {
    static Command: CommandManager
    static Status: StatusManager
}