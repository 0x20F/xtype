import { storage } from 'foundation/components/LocalStorage';
import { createIdenticon } from 'foundation/Identicon';
import {sha512} from "./math/Hashes";


const maxEntries = 15;
let items = [];




const sortEntry = (a, b) => {
    return b.totalWaves - a.totalWaves || b.score - a.score;
}


/**
 * Adds a new entry to the local storage leaderboard,
 * while making sure the amount doesn't exceed the limit.
 *
 * @param {{ name: string, signature: string }} who The player name
 * @param {string} accuracy The average accuracy over all rounds
 * @param {string} wpm The average wpm over all rounds
 * @param {number} score Entire score for the run
 */
export const addEntry = async (who, accuracy, wpm, score, totalWaves) => {
    const { name, signature } = who;

    let entry = {
        playerName: name,
        signature: await sha512(signature),
        accuracy,
        wpm,
        score,
        totalWaves
    };

    if (storage.exists('leaderboard')) {
        items = JSON.parse(storage.get('leaderboard'));
    }

    items.push(entry);
    items.sort(sortEntry);

    if (items.length > maxEntries) {
        items = items.slice(0, maxEntries);
    }

    storage.set('leaderboard', JSON.stringify(items));

    return items;
}


/**
 * Returns all leaderboard entries as an array
 * of objects
 */
export const allEntries = () => {
    let entries = storage.get('leaderboard');

    if (!entries) {
        return [];
    }

    return JSON.parse(entries);
}
