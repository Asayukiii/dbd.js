import { InstanceData } from '../compiler/build'

export default async function(d: InstanceData) {
    if (!d.hasUsage())
        return d.error('Invalid usage of Function!');
    const [condition, errorMessage = ' '] = d.unpack(d.unpacked).splits;
    const bool = d.util.checkCondition(condition);
    if (!bool) {
        d.error(errorMessage);
        d.errorWasClient = true;
    }
    return '';
}
