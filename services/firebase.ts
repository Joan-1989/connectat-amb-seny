// services/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, type Functions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, type FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

// ⚙️ Carreguem la config des de variables d'entorn (Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  // Opcional:
  measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string) || undefined,
};

// 🏁 Singleton de l’app
const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// 🔌 Serveis que fem servir a la web
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
// IMPORTANT: mateixes regió i nom que les Cloud Functions (europe-west1)
const functions: Functions = getFunctions(app, 'europe-west1');
const storage: FirebaseStorage = getStorage(app);

// 📈 Analytics (només navegador i si és suportat)
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  isSupported()
    .then((ok) => {
      if (ok) analytics = getAnalytics(app);
    })
    .catch(() => {
      /* ignorem si no està suportat */
    });
}

// 🧪 Emuladors locals (opcionales): activa-ho amb VITE_USE_EMULATORS=true o executant a localhost
const useEmulators =
  import.meta.env.VITE_USE_EMULATORS === 'true' ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost');

if (useEmulators) {
  try {
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  } catch {}
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  } catch {}
  try {
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  } catch {}
  try {
    connectStorageEmulator(storage, '127.0.0.1', 9199);
  } catch {}
}

// ✅ Exports
export { app, db, auth, functions, storage, analytics };
