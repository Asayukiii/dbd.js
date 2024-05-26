import { InstanceData } from '../compiler/build'

export default async function(d: InstanceData) {
    if (!d.hasUsage())
        return d.error('Invalid usage of Function!');
    if (!d.data.message)
        return d.error('Unexpected object Message of \'null\'!');
    const message = d.data.message;
    const emojis = d.unpack(d.unpacked).splits;
    for (const emoji of emojis)
        message.react(emoji);
    return '';
}
