import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

export const useFirestore = () => {
    const fs = getFirestore();

    if (location.host.includes('localhost')) {
        console.log('%cConnecting to local emulator!', 'color: rebeccapurple;font-size:22px');
        connectFirestoreEmulator(fs, 'localhost', 1337);
    }

    return fs;
}
