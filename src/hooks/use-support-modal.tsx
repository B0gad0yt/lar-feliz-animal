'use client';

import { useState, useEffect } from 'react';

const SUPPORT_MODAL_KEY = 'lar-feliz-support-modal-read';

export function useSupportModal() {
  const [hasReadModal, setHasReadModal] = useState(true); // Default true to prevent flash

  useEffect(() => {
    // Check if user has already read the modal
    const hasRead = localStorage.getItem(SUPPORT_MODAL_KEY) === 'true';
    setHasReadModal(hasRead);
  }, []);

  const markAsRead = () => {
    localStorage.setItem(SUPPORT_MODAL_KEY, 'true');
    setHasReadModal(true);
  };

  return { hasReadModal, markAsRead };
}
