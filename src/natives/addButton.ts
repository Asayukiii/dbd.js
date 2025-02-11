import { InstanceData } from '../compiler/build'
import * as djs from 'discord.js'

const Styles = ['PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER', 'LINK'];

export default async function(d: InstanceData) {
    if (!d.hasUsage())
        return d.error("Invalid usage of Function!");
    const [newRow = 'no', resolvable, label, style = 'primary', disabled = 'no', emoji = '', messageId, channelId] = d.unpack(d.unpacked).splits;
    if (!resolvable)
        return d.error("Field 2 is required!");
    
    const buttonStyle = Styles.findIndex(v => v === style.toUpperCase());
    const button = new djs.ButtonBuilder({
        url: resolvable,
        customId: resolvable,
        label,
        style: buttonStyle,
        disabled: disabled === "yes",
        emoji
    });
    
    if (messageId) {
        let channel = d.data.channel;
        if (channelId) {
            const _bigint2 = `${BigInt(channelId)}`;
            channel = await (d.util.getChannel(d.data.client, _bigint2)).catch(err => null);
        }
        if (!channel)
            return d.error('Invalid channel of Channel!');
        const _bigint1 = `${BigInt(messageId)}`;
        const message = await channel.messages.fetch(_bigint1, { cache: true, force: false });
        if (!message)
            return d.error("Invalid message of Message Id!");
        if (message.author.id !== d.data.client.user.id)
            return d.error("Incompatible Author of Id with Client for EditMessage!");
        const newComponents = [...message.components];
        let row = newComponents.pop();
        if (newRow === "yes" || row.components.length > 4 || row.components[0] instanceof djs.StringSelectMenuComponent) {
            if (newComponents.length > 4)
                return d.error("ACTION_ROW Limit reached, create Failed!");
            row = new djs.ActionRowBuilder();
            newComponents.push(row);
        }
        row.addComponents(button);
        d.editMessage = message;
        d.editMessage.components = newComponents;
    } else {
        let row = d.sendOptions.components.reverse()[0];
        if (newRow === "yes" || row.components.length > 4 || row.components[0] instanceof djs.StringSelectMenuComponent) {
            if (d.sendOptions.components.length > 4)
                return d.error("ACTION_ROW Limit reached, create Failed!");
            row = new djs.ActionRowBuilder();
            d.sendOptions.components.push(row);
        }
        row.components.push(button);
    }
}
