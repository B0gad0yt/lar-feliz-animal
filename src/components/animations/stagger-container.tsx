'use client';

import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export interface StaggerContainerProps extends HTMLAttributes<HTMLDivElement> {
  stagger?: number;
  delay?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  )
);
