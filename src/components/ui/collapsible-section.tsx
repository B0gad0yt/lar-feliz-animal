'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface CollapsibleSectionProps {
  title: ReactNode;
  children: ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
  iconPosition?: 'left' | 'right';
  forceMount?: boolean; // para forçar render mesmo fechado
}

export function CollapsibleSection({
  title,
  children,
  defaultCollapsed = true,
  className,
  iconPosition = 'right',
  forceMount = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(!defaultCollapsed);
  const [mounted, setMounted] = useState(false);

  // Delay hydrating the animated wrapper until after mount to avoid SSR mismatch.
  useEffect(() => {
    setMounted(true);
  }, []);
  const toggle = () => setOpen(o => !o);

  return (
    <Card className={cn('bg-card/70 backdrop-blur-sm border-0 shadow-lg', className)}>
      <CardHeader
        onClick={toggle}
        className={cn('cursor-pointer select-none flex flex-row items-center gap-2 py-4',
          iconPosition === 'right' && 'justify-between')}
      >
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          {iconPosition === 'left' && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label={open ? 'Recolher seção' : 'Expandir seção'}
            >
              {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          )}
          {title}
        </CardTitle>
        {iconPosition === 'right' && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={open ? 'Recolher seção' : 'Expandir seção'}
          >
            {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        )}
      </CardHeader>
      {mounted ? (
        <AnimatePresence initial={false}>
          {(open || forceMount) && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <CardContent className="pt-0">
                {children}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        (open || forceMount) && (
          <CardContent className="pt-0">
            {children}
          </CardContent>
        )
      )}
    </Card>
  );
}
