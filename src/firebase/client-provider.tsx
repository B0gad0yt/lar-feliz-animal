'use client';
import { useEffect, useState } from 'react';
import { initializeFirebase } from './';
import { FirebaseProvider } from './provider';
import { syncUserSession } from '@/lib/client-auth-session';

// NOTE: This is a client-only provider that will not be rendered on the server
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebaseInstances, setFirebaseInstances] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    // Initialize Firebase only on the client side
    const instances = initializeFirebase();
    setFirebaseInstances(instances);
  }, []);

  useEffect(() => {
    if (!firebaseInstances?.auth) {
      return;
    }

    const unsubscribe = firebaseInstances.auth.onIdTokenChanged((user) => {
      void syncUserSession(user);
    });

    return () => unsubscribe();
  }, [firebaseInstances?.auth]);

  if (
    !firebaseInstances?.firebaseApp ||
    !firebaseInstances?.firestore ||
    !firebaseInstances?.auth
  ) {
    // You can render a loading state here if needed
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseInstances.firebaseApp}
      firestore={firebaseInstances.firestore}
      auth={firebaseInstances.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
