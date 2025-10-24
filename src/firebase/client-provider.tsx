'use client';
import { initializeFirebase } from './';
import { FirebaseProvider } from './provider';

// NOTE: This is a client-only provider that will not be rendered on the server
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, firestore, auth } = initializeFirebase();

  if (!firebaseApp) {
    return null;
  }

  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
