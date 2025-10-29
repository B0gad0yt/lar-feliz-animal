"use client";

import type { ReactNode, HTMLAttributes } from "react";
import { createElement } from "react";

interface AutoRevealProps extends HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  immediate?: boolean;
  disabled?: boolean;
}

// AutoReveal now renders children immediately without scroll-based motion.
export function AutoReveal({
  as = "div",
  children,
  className,
  ...rest
}: AutoRevealProps) {
  return createElement(
    as,
    {
      ...(rest as Record<string, unknown>),
      className,
    },
    children,
  );
}
