import { TypedEmitter } from "tiny-typed-emitter";
import { Command } from "./Managers";
import { Collection } from "./Util";
import { Main } from "../main/Main";

class Events extends TypedEmitter {
    commands = new Collection<string | symbol, Array<Command>>()
    data: Record<string, any> = {}
    private _events: string[] = [];
    
    addDataToCompiler(key: string, value: any) {
        this.data[key] = value;
    }
    
    listen(event: string | symbol, ...commands: Command[]) {
        if (!(this._events.includes(event as string))) {
            this._events.push(event as string);
            this.on(event as string, this.onEvent());
        }
        
        let array: Command[] = [];
        
        if (!(this.commands.has(event))) {
            this.commands.set(event, array);
        }
        
        array = array.concat(commands);
        
        return this;
    }
    
    onEvent(eventName?: string | symbol) {
        return (...eventData: any[]) => {
            const commands = this.commands.get(eventName);
            for (const command of commands) {
                Main._compile(command, {
                    eventData,
                    ...this.data
                });
            }
        };
    };
}
export default Events;