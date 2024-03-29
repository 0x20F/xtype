
/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 * Stolen from: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 *
 * @param {string} str the input value
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 *
 * @returns {string}
 */
export const hashFnv32a = (string, seed) => {
    let str = string;

    let i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }

    return ("00000000" + (hval >>> 0).toString(16)).substr(-8);
}

export const sha512 = async from => {
    const buf = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(from))

    return Array
        .prototype
        .map
        .call(
            new Uint8Array(buf),
            x => (( '00' + x.toString(16)).slice(-2))
        )
        .join('');
}

