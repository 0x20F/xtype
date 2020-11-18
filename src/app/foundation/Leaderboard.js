import { storage } from 'foundation/components/LocalStorage';
import { createIdenticon } from 'foundation/Identicon';


class Leaderboard {
    maxEntries = 6;
    items;

    constructor() {
        this.items = storage.get('leaderboard') ?? [];
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
    addEntry = (who, accuracy, wpm, score) => {
        let entry = {
            playerName: who,
            playerAvatar: createIdenticon(who),
            accuracy,
            wpm,
            score
        };

        this.items.push(entry);
        this.items.sort(this.sortEntry);

        if (this.items.length > this.maxEntries) {
            this.items = this.items.slice(0, this.maxEntries);
        }

        return this.items;
    }

    
    sortEntry = (a, b) => {
        return a.score < b.score;
    }
}


export default Leaderboard;