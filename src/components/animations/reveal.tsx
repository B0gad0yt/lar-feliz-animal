'use client';

import { forwardRef, createElement } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const motionMap = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  span: motion.span,
  li: motion.li,
  header: motion.header,
  footer: motion.footer,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  p: motion.p,
} as const;

type RevealElement = keyof typeof motionMap;

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealElement;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const DEFAULT_DISTANCE = 24;

export const Reveal = forwardRef<HTMLElement, RevealProps>(function Reveal(
  {
    as = 'div',
    delay = 0,
    duration = 0.6,
    distance = DEFAULT_DISTANCE,
    once = true,
    className,
    children,
    ...rest
  },
  ref
) {
  const MotionTag = motionMap[as] ?? motion.div;
  const prefersReducedMotion = useReducedMotion();
  const restProps = rest as any;

  if (prefersReducedMotion) {
    const Comp = as as keyof JSX.IntrinsicElements;
    return createElement(
      Comp,
      {
        ...(restProps ?? {}),
        ref,
        className,
        'data-motion': 'manual',
      },
      children
    );
  }

  return (
    <MotionTag
      ref={ref as never}
      className={cn('will-change-transform will-change-opacity', className)}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      data-motion="manual"
      {...restProps}
    >
      {children}
    </MotionTag>
  );
});
