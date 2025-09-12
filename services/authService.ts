import { auth, db } from './firebase';
import type { User, UserProfile } from '../types';
// Importa les funcions modulars v9+
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    type User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    // Utilitza la nova API modular per a Firestore
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
    }
    return null;
}

export const register = async (email: string, pass: string, profile: UserProfile): Promise<User> => {
    try {
        // Utilitza la nova API modular per a l'autenticació
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const firebaseUser = userCredential.user;

        // Guarda el perfil de l'usuari a Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, profile);

        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            profile
        };
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error("L'adreça de correu electrònic ja està en ús.");
        }
        throw new Error("S'ha produït un error durant el registre.");
    }
};

export const login = async (email: string, pass: string): Promise<User> => {
    try {
        // Utilitza la nova API modular per a l'autenticació
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const firebaseUser = userCredential.user;

        const profile = await getUserProfile(firebaseUser.uid);

        if (!profile) {
            throw new Error("No s'ha trobat el perfil de l'usuari.");
        }

        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            profile
        };
    } catch (error: any) {
         if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            throw new Error('Les credencials són incorrectes.');
        }
        throw new Error("S'ha produït un error en iniciar sessió.");
    }
};

export const logout = (): Promise<void> => {
    // Utilitza la nova API modular
    return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    // Utilitza la nova API modular
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            const profile = await getUserProfile(firebaseUser.uid);
             if (profile) {
                callback({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email!,
                    profile
                });
            } else {
                 await logout();
                 callback(null);
            }
        } else {
            callback(null);
        }
    });
};
