'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

type RevealType = 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'fade';

type AnimationConfig = {
  type: RevealType;
  delay: number;
  distance: number;
};

const SELECTORS = ['[data-animate]', 'main > *', 'section', 'header', 'footer', 'article', 'aside'];
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const DEFAULT_DISTANCE = 32;

function resolveConfig(element: HTMLElement): AnimationConfig {
  const type = (element.dataset.animate as RevealType) || 'slide-up';
  const delay = element.dataset.animateDelay ? Number(element.dataset.animateDelay) : 0;
  const distance = element.dataset.animateDistance ? Number(element.dataset.animateDistance) : DEFAULT_DISTANCE;

  return { type, delay, distance };
}

function applyInitialStyles(element: HTMLElement, config: AnimationConfig) {
  const { type, delay, distance } = config;
  const baseTransform = {
    'slide-up': `translateY(${distance}px)`,
    'slide-down': `translateY(-${distance}px)`,
    'slide-left': `translateX(${distance}px)`,
    'slide-right': `translateX(-${distance}px)`,
    fade: 'scale(0.98)',
  };

  if (element.classList.contains('is-visible')) {
    return;
  }

  element.classList.add('reveal-element');
  element.style.setProperty('--reveal-ease', EASE);
  element.style.setProperty('--reveal-delay', `${delay}s`);
  element.style.setProperty('--reveal-transform', baseTransform[type]);
}

export function MotionOrchestrator() {
  const preferReducedMotion = useReducedMotion();

  useEffect(() => {
    if (preferReducedMotion) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    const observed = new Set<HTMLElement>();

    const registerElement = (element: Element | null) => {
      if (!element || !(element instanceof HTMLElement)) {
        return;
      }

      if (element.dataset.animate === 'off' || element.dataset.motion === 'manual' || element.hasAttribute('data-animate-disable')) {
        return;
      }

      if (observed.has(element)) {
        return;
      }

      const config = resolveConfig(element);
      applyInitialStyles(element, config);
      intersectionObserver.observe(element);
      observed.add(element);
    };

    const scanDom = () => {
      SELECTORS.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => registerElement(element));
      });
    };

    scanDom();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }

          registerElement(node);

          SELECTORS.forEach((selector) => {
            node.querySelectorAll?.(selector).forEach((element) => registerElement(element));
          });
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
      observed.clear();
    };
  }, [preferReducedMotion]);

  return null;
}
