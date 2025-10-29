"use client";

import { motion } from "framer-motion";
import type { ReactNode, HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Usamos um subconjunto seguro de atributos HTML para evitar conflito com tipos de drag do framer-motion.
// Removemos handlers de drag pois os tipos de framer-motion diferem dos típicos do React (<DragEvent>)
interface AutoRevealProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragCapture' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver'> {
  /** Elemento base a ser renderizado: div, section, article, li, etc. */
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
  /** Atraso da animação em segundos */
  delay?: number;
  /** Duração da animação em segundos */
  duration?: number;
  /** Offset vertical inicial (px) */
  y?: number;
  /** Forçar render visível imediatamente sem observer */
  immediate?: boolean;
  /** Desativar animação totalmente (útil para listas grandes) */
  disabled?: boolean;
}

/**
 * AutoReveal
 * Anima (fade + translate Y) quando o elemento entra no viewport.
 * Corrige bug em alguns navegadores mobile onde IntersectionObserver não dispara
 * até o usuário scrollar mais: possui fallback por timeout. Se `immediate` true,
 * revela instantaneamente.
 */
export function AutoReveal({
  as = "div",
  children,
  className,
  delay = 0,
  duration = 0.5,
  y = 16,
  immediate = false,
  disabled = false,
  ...rest
}: AutoRevealProps) {
  const Tag = as as any;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(immediate || disabled);

  useEffect(() => {
    if (visible || immediate || disabled) return; // já visível / sem animação
    const node = ref.current;
    if (!node) return;

    const isBrowser = typeof window !== 'undefined';
    const isTouch = isBrowser && 'ontouchstart' in window;
    const supportsIO = isBrowser && 'IntersectionObserver' in window;

    // Checagem imediata: se já está dentro do viewport ao montar, mostra sem esperar observer.
    if (isBrowser) {
      const rect = node.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        setVisible(true);
        return;
      }
    }

    if (supportsIO) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setVisible(true);
              observer.disconnect();
              break;
            }
          }
        },
        {
          root: null,
          rootMargin: '0px 0px -15% 0px',
          threshold: 0,
        }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }

    // Fallback mobile / ambientes sem IntersectionObserver.
    const t = setTimeout(() => setVisible(true), isTouch ? 50 : 0);
    return () => clearTimeout(t);
  }, [visible, immediate, disabled]);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (disabled) {
    return (
      <Tag ref={ref} className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  // Filtrar explicitamente handlers de drag para evitar erro de tipagem com framer-motion.
  const { onDrag, onDragStart, onDragEnd, onDragCapture, onDragEnter, onDragExit, onDragLeave, onDragOver, ...safeRest } = rest as any;

  return (
    <motion.div
      ref={ref as any}
      initial={visible ? false : { opacity: 0, y: prefersReduced ? 0 : y }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('will-change-transform will-change-opacity', className)}
      {...safeRest}
    >
      <Tag className="contents">{children}</Tag>
    </motion.div>
  );
}
