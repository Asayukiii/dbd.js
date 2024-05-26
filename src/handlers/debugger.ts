import { TypedEmitter } from "tiny-typed-emitter";

interface DebuggerEvents {
    debug: (message: string) => unknown;
    error: (error: Error) => unknown;
}

/** All enumerated debug flags. */
enum FLAGS {
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    UNEXPECTED = 4
}

/** All flags to string. */
const FLAGS_STRINGS = Object.keys(FLAGS)

class DebuggerEmitter extends TypedEmitter<DebuggerEvents> {}
/** Debugger event emitter. */
const Events = new DebuggerEmitter();

/** Debugger logger. */
function log(message: string, code: FLAGS) {
    if (FLAGS.INFO === code) {
        Events.emit('debug', `\x1b[47m\x1b[30mdbd.js [DEBUG \x1b[32mInfo\x1b[30m]: ${message}\x1b[0m`);
    } else if (FLAGS.WARN === code) {
        Events.emit('debug', `\x1b[43m\x1b[30mdbd.js [DEBUG \x1b[33mWarn\x1b[30m]: ${message}\x1b[0m`);
    } else if (FLAGS.ERROR === code) {
        Events.emit('debug', `\x1b[41m\x1b[30mdbd.js [DEBUG \x1b[36mError\x1b[30m]: ${message}\x1b[0m`);
    } else if (FLAGS.UNEXPECTED === code) {
        Events.emit('debug', `\x1b[41m\x1b[30mdbd.js [DEBUG \x1b[36mUnexpected\x1b[30m]: ${message}\x1b[0m`);
    }
}

class Debugger {
    static FLAGS = FLAGS
    static Events = Events
    static log = log
}

export default Debugger;