'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, User, LogOut, Shield } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';

import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import type { User as AppUser, SiteConfig } from '@/lib/types';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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
  const { user, loading } = useUser();
  const firestore = useFirestore();
  const auth = getAuth();
  
  const userDocRef = useMemo(() => firestore && user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: appUser } = useDoc<AppUser>(userDocRef);

  const configRef = useMemo(() => firestore ? doc(firestore, 'config', 'site') : null, [firestore]);
  const { data: siteConfig } = useDoc<SiteConfig>(configRef);
  
  const isAdmin = appUser?.role === 'admin';

  const handleSignOut = () => {
    signOut(auth);
  };

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

  const UserNav = () => {
    if (loading) {
      return null; // ou um skeleton
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'Usuário'} />
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem asChild>
                 <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Painel Admin</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
        <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/register">
                    <User className="mr-2 h-4 w-4" /> Cadastre-se
                </Link>
            </Button>
        </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="hidden sm:inline-block font-bold font-headline text-xl">
            {siteConfig?.title || 'Lar Feliz Animal'}
          </span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          <UserNav />
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background/95 backdrop-blur-sm p-0">
                <SheetTitle className="sr-only">Menu Principal</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                   <Link href="/" className="flex items-center space-x-2" onClick={() => setSheetOpen(false)}>
                      <Logo className="h-8 w-8 text-primary" />
                      <span className="font-bold font-headline text-lg">{siteConfig?.title || 'Lar Feliz Animal'}</span>
                    </Link>
                </div>
                <nav className="flex flex-col space-y-4 p-4 text-lg">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                  {isAdmin && <NavLink href="/admin" label="Painel Admin" />}
                </nav>
                 <div className="mt-auto p-4 border-t">
                  {user ? (
                     <div className="flex items-center space-x-4">
                       <Avatar>
                         <AvatarImage src={user.photoURL || ''} />
                         <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div>
                         <p className="font-semibold">{user.displayName}</p>
                         <Button variant="link" className="p-0 h-auto text-muted-foreground" onClick={() => { handleSignOut(); setSheetOpen(false); }}>Sair</Button>
                       </div>
                     </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                        <Button asChild className="w-full" onClick={() => setSheetOpen(false)}>
                            <Link href="/login">Login</Link>
                        </Button>
                         <Button variant="outline" asChild className="w-full" onClick={() => setSheetOpen(false)}>
                            <Link href="/register">Cadastre-se</Link>
                        </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
