import { storage } from 'foundation/components/LocalStorage';
import { createIdenticon } from 'foundation/Identicon';


const maxEntries = 6;
let items = [];




const sortEntry = (a, b) => {
    return a.score < b.score;
}


/**
 * Adds a new entry to the local storage leaderboard,
 * while making sure the amount doesn't exceed the limit.
 * 
 * @param {string} who The player name
 * @param {string} accuracy The average accuracy over all rounds
 * @param {string} wpm The average wpm over all rounds
 * @param {number} score Entire score for the run
 */
export const addEntry = (who, accuracy, wpm, score) => {
    let entry = {
        playerName: who,
        playerAvatar: createIdenticon(who),
        accuracy,
        wpm,
        score
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