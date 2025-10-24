'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PawPrint, X } from 'lucide-react';
import { useState } from 'react';

import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/adopt', label: 'Adotar' },
  { href: '/matcher', label: 'Encontrar Match' },
  { href: '/education', label: 'Educação' },
  { href: '/shelters', label: 'Abrigos' },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const NavLink = ({ href, label, className }: { href: string; label: string; className?: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          'text-foreground/70 transition-colors hover:text-foreground',
          isActive && 'text-foreground font-semibold',
          className
        )}
        onClick={() => setSheetOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline text-xl">
            Lar Feliz Animal
          </span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild className="hidden md:flex">
            <Link href="/adopt">
              <PawPrint className="mr-2 h-4 w-4" /> Adotar
            </Link>
          </Button>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                   <Link href="/" className="flex items-center space-x-2" onClick={() => setSheetOpen(false)}>
                      <Logo className="h-8 w-8 text-primary" />
                      <span className="font-bold font-headline text-lg">Lar Feliz Animal</span>
                    </Link>
                </div>
                <nav className="flex flex-col space-y-4 p-4 text-lg">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                </nav>
                <div className="mt-auto p-4">
                  <Button asChild className="w-full">
                    <Link href="/adopt" onClick={() => setSheetOpen(false)}>
                      <PawPrint className="mr-2 h-4 w-4" /> Adotar
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
