import { storage } from 'foundation/components/LocalStorage';
import {sha512} from "./math/Hashes";
import { collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';
import {useFirestore} from "../support/Database";


const maxEntries = 15;
let items = [];




const sortEntry = (a, b) => {
    return b.totalWaves - a.totalWaves || b.score - a.score;
}


/**
 * Adds a new entry to the local storage leaderboard,
 * while making sure the amount doesn't exceed the limit.
 * The limit does not apply to the global database, however.
 *
 * @param {{ name: string, signature: string }} who The player name
 * @param {string} accuracy The average accuracy over all rounds
 * @param {string} wpm The average wpm over all rounds
 * @param {number} score Entire score for the run
 */
export const addEntry = async (who, accuracy, wpm, score, totalWaves) => {
    const { name, signature } = who;

    let entry = {
        id: await sha512(signature + name),
        playerName: name,
        signature: await sha512(signature),
        accuracy,
        wpm,
        score,
        totalWaves
    };

    // We want to overwrite any entries for this ID in
    // the global database, but just append in the local database

    // Add to firebase
    try {
        const db = useFirestore();
        const collectionRef = collection(db, 'global-leaderboard');
        const docRef = doc(collectionRef, entry.id);

        const docSnap = await getDoc(docRef);

        // Update it
        if (docSnap.exists()) {
            const old = docSnap.data();

            // Only update if the score is higher
            if (entry.score > old.score) {
                await setDoc(docRef, entry);
            }
        } else {
            await setDoc(docRef, entry);
        }
    } catch (e) {
        console.error(e);
        console.log('Could not set score to global database... Oh well...');
    }

    // Add to local storage
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
export const allEntries = async (from) => {
    if (from === 'local') {
        let entries = storage.get('leaderboard');

        if (!entries) {
            return [];
        }

        return JSON.parse(entries);
    }

    if (from === 'global') {
        const db = useFirestore();
        const collectionRef = collection(db, 'global-leaderboard');
        const docs = await getDocs(collectionRef);

        const final = [];
        docs.forEach(doc => {
            final.push(doc.data());
        })

        return final;
    }
}
