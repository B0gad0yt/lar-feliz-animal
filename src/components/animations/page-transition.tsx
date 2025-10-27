'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Transition } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

const TRANSITION: Transition = {
  duration: 0.45,
  ease: [0.4, 0, 0.2, 1] as const,
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={TRANSITION}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
