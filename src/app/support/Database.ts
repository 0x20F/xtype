import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

let fs = null;

export const useFirestore = () => {
    if (fs !== null) {
        return fs;
    }

    fs = getFirestore();

    if (location.host.includes('localhost')) {
        console.log('%cConnecting to local emulator!', 'color: rebeccapurple;font-size:22px');
        connectFirestoreEmulator(fs, 'localhost', 1337);
    }

    return fs;
}
