'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error(error); // Log the full error for debugging in the browser console

      // For developers, throw the error to show it in the Next.js overlay
      if (process.env.NODE_ENV === 'development') {
        // We throw a new error with the same message to get a better stack trace
        throw new Error(error.message);
      } else {
        // For users in production, show a friendly toast.
        toast({
          variant: 'destructive',
          title: 'Permissão Negada',
          description: 'Você não tem permissão para realizar esta ação.',
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
