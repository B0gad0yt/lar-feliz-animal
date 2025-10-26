import { TinyEmitter } from 'tiny-emitter';
import type { FirestorePermissionError } from './errors';

type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

type EventKey = keyof AppEvents;
type EventHandler<K extends EventKey> = AppEvents[K];

class TypedEmitter<TEvents extends Record<string, (...args: any[]) => void>> {
  private emitter = new TinyEmitter();

  on<K extends keyof TEvents>(event: K, callback: TEvents[K], ctx?: unknown) {
    this.emitter.on(event as string, callback as (...args: any[]) => void, ctx);
    return this;
  }

  once<K extends keyof TEvents>(event: K, callback: TEvents[K], ctx?: unknown) {
    this.emitter.once(event as string, callback as (...args: any[]) => void, ctx);
    return this;
  }

  off<K extends keyof TEvents>(event: K, callback?: TEvents[K]) {
    this.emitter.off(event as string, callback as (...args: any[]) => void | undefined);
    return this;
  }

  emit<K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>) {
    this.emitter.emit(event as string, ...args);
    return this;
  }
}

export const errorEmitter = new TypedEmitter<AppEvents>();
