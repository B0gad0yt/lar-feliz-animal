import { Emitter } from 'tiny-emitter';
import type { FirestorePermissionError } from './errors';

type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// tiny-emitter doesn't have typed events out of the box, so we cast it.
// This provides the same level of type safety as the previous implementation.
export const errorEmitter = new Emitter() as Emitter<AppEvents>;
