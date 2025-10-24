import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  firestore: null,
  auth: null,
});

export function FirebaseProvider({
  children,
  ...rest
}: {
  children: React.ReactNode;
} & FirebaseContextValue) {
  return (
    <FirebaseContext.Provider value={rest}>{children}</FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);

export const useFirebaseApp = () => useContext(FirebaseContext).firebaseApp;

export const useFirestore = () => useContext(FirebaseContext).firestore;

export const useAuth = () => useContext(FirebaseContext).auth;
