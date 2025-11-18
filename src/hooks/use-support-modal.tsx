'use client';

import { useState, useEffect } from 'react';

const SUPPORT_MODAL_COOKIE = 'lar-feliz-support-modal-read';

// Helper functions for cookies
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

export function useSupportModal() {
  const [hasReadModal, setHasReadModal] = useState(true); // Default true to prevent flash

  useEffect(() => {
    // Check if user has already read the modal via cookie
    const hasRead = getCookie(SUPPORT_MODAL_COOKIE) === 'true';
    setHasReadModal(hasRead);
  }, []);

  const markAsRead = () => {
    setCookie(SUPPORT_MODAL_COOKIE, 'true', 365);
    setHasReadModal(true);
  };

  return { hasReadModal, markAsRead };
}
