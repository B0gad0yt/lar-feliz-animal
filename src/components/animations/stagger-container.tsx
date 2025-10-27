'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { HTMLAttributes } from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: ({ stagger = 0.15, delay = 0 }: { stagger?: number; delay?: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  }),
};

export interface StaggerContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag'> {
  stagger?: number;
  delay?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ className, children, stagger = 0.15, delay = 0, ...rest }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
      return (
        <div ref={ref} className={className} data-motion="manual" {...rest}>
          {children}
        </div>
      );
    }

    const motionProps = rest as HTMLMotionProps<'div'>;

    return (
      <motion.div
        ref={ref}
        className={cn('will-change-transform will-change-opacity', className)}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={{ stagger, delay }}
        data-motion="manual"
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);
