'use client';

import { forwardRef, createElement } from 'react';
import type { HTMLAttributes } from 'react';

type RevealElement = keyof JSX.IntrinsicElements;

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealElement;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

// Render content immediately without scroll-triggered motion.
export const Reveal = forwardRef<HTMLElement, RevealProps>(function Reveal(
  { as = 'div', className, children, ...rest },
  ref
) {
  const Comp = as as RevealElement;
  return createElement(
    Comp,
    {
      ...(rest as Record<string, unknown>),
      ref,
      className,
    },
    children
  );
});
