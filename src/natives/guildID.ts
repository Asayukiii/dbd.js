import { InstanceData } from '../compiler/build'

export default async function(d: InstanceData) {
    return d.data.guild?.id
}
