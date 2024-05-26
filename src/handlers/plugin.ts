import { FunctionList } from '../compiler/functions';
import { InstanceData } from '../compiler/build';

/** A data Resolvable that allows to make custom Functions for dbd.js Compiler */
interface PluginResolvable {
    /** A string that will represents the Function */
    identifier: string;
    /** Identifies wether Function Usage should be compiled */
    compileUnpacked: boolean;
    /** A callback that will return as a response from function */
    callback: (data: InstanceData) => any;
}

/** A class Instance of CompilerPlugin for managing available Plugins*/
class PluginManager extends Map<string, PluginResolvable> {
    add(...Plugins: PluginResolvable[]) {
        const args = Util.iterateArgs(Plugins);
        for (const plugin of args) {
            if (!CompilerPlugin.overwriteNative && FunctionList["$" + plugin.identifier]) {
                console.error('Overwriting Built-In Functions are not allowed, you can change this rule by changing \'CompilerPlugin.overwriteNative\' and set as \'true\'');
                break;
            }
            plugin.identifier = "$" + plugin.identifier;
            this.set(plugin.identifier, plugin);
        }
    }
    
    push(...Plugins: PluginResolvable[]) {
        const args = Util.iterateArgs(Plugins);
        for (const plugin of args) {
            if (!CompilerPlugin.overwriteNative && FunctionList["$" + plugin.identifier]) {
                console.error('Overwriting Built-In Functions are not allowed, you can change this rule by changing \'CompilerPlugin.overwriteNative\' and set as \'true\'');
                break;
            }
            plugin.identifier = "$" + plugin.identifier;
            this.set(plugin.identifier, plugin);
        }
    }
    
    array(): PluginResolvable[] {
        return Array.from(this.values())
    }
}

export class CompilerPlugin {
    /** A Rule that allows manager to overwrites an existing built-in function if plugin's identifier are equal */
    static overwriteNative: boolean = false;
    static registeredPlugins: string[] = [];
    static manager = new PluginManager()
}