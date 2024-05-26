import { PresenceStatusData, ActivityType } from "discord.js";
import { Command } from "./managers";
import { Collection } from "./Util";
import Main from '../main/Main';

export interface Status {
    name: string;
    type: ActivityType;
    url: string;
    Lifetime: 10 | number;
    status: PresenceStatusData;
    compile: (command: Command, data: any) => Promise<string>;
}

/**
 *
 * @param Activities
 * @param This
 */
function StatusHandler(Activities: Collection<string, Status>, This: Main) {
    const Arr = Array.from(Activities.values());
    
    if (!Arr.length || Arr.length < 1) return;
    if (Arr.length === 1) {
        const status = Arr[0];
        This.client.user.setStatus(status.status);
        This.client.user.setActivity(status.name, { type: status.type, url: status.url });
        console.warn(`Length of Activities was 1, Recommended Lifetime duration should be more than 30 `);
    }
    
    let i = 0;
    let Timeout = setTimeout(update, 1000);
    
    async function update() {
        clearTimeout(Timeout);
        Timeout = null;
        
        let status = Arr[i];
        if (!status) {
            status = Arr[0];
            i = 0;
        }
        i++;
        
        const ActivityDisplay = await status.compile({
            code: status.name
        }, { returnCode: true });
        
        This.client.user.setStatus(status.status);
        This.client.user.setActivity(ActivityDisplay, { type: status.type, url: status.url });
        Timeout = setTimeout(update, status.Lifetime * 1000);
    }
};

export default StatusHandler;