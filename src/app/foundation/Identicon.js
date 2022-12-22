import Identicon from 'identicon.js';
import { hashFnv32a } from 'foundation/math/Hashes';


export const createIdenticon = (seed, options) => {
    options = options ?? {};

    let hash = hashFnv32a(seed, 12345) + hashFnv32a(seed, 54321);
    let src = 'data:image/svg+xml;base64,' + new Identicon(hash, {
        background: options.background ?? [24, 27, 33, 1],
        margin: options.margin ?? 0,
        size: options.size ?? 60,
        format: options.format ?? 'svg'
    });

    return src.toString();
}
