'use client';

import type { User } from 'firebase/auth';

const SESSION_ENDPOINT = '/api/auth/session';

async function postJSON(input: RequestInfo, init?: RequestInit) {
  return fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

export async function syncUserSession(user: User | null) {
  if (typeof window === 'undefined') return;

  try {
    if (!user) {
      await fetch(SESSION_ENDPOINT, { method: 'DELETE' });
      return;
    }

    const token = await user.getIdToken();
    await postJSON(SESSION_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.error('Failed to synchronize auth session cookie', error);
  }
}
