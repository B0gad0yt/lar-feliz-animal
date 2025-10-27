import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  FirebaseProvider,
} from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';

function initializeFirebase(): {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
} {
  // Verifica se as variáveis de ambiente do Firebase estão configuradas
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase config not found. Please set environment variables.');
    return {
      firebaseApp: null,
      firestore: null,
      auth: null,
    };
  }

  try {
    const firebaseApp = !getApps().length
      ? initializeApp(firebaseConfig)
      : getApp();
    const firestore = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);

    return {
      firebaseApp,
      firestore,
      auth,
    };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return {
      firebaseApp: null,
      firestore: null,
      auth: null,
    };
  }
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useUser,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
