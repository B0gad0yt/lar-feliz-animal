'use client';

import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// Page transitions are disabled; we simply render the children directly.
export function PageTransition({ children }: PageTransitionProps) {
  return <>{children}</>;
}
