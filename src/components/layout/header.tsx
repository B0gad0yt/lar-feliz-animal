'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, User, LogOut, Shield, UserCog, Heart } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { MotionConfig } from 'framer-motion';

import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { useFavorites } from '@/hooks/use-favorites';
import { getAuth, signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';
import type { User as AppUser, SiteConfig } from '@/lib/types';
import { StaggerContainer } from '@/components/animations/stagger-container';
import { Reveal } from '@/components/animations/reveal';


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
  { href: '/favorites', label: 'Favoritos', icon: Heart },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { user, loading } = useUser();
  const { favorites } = useFavorites();
  const firestore = useFirestore();
  const auth = getAuth();
  
  const userDocRef = useMemo(() => (firestore && user ? (doc(firestore, 'users', user.uid) as DocumentReference<AppUser>) : null), [firestore, user]);
  const { data: appUser } = useDoc<AppUser>(userDocRef);

  const configRef = useMemo(() => (firestore ? (doc(firestore, 'config', 'site') as DocumentReference<SiteConfig>) : null), [firestore]);
  const { data: siteConfig } = useDoc<SiteConfig>(configRef);
  
  const isAdmin = appUser?.role === 'operator' || appUser?.role === 'shelterAdmin';

  const handleSignOut = () => {
    signOut(auth);
  };

  const NavLink = ({ href, label, icon: Icon, className }: { href: string; label: string; icon?: React.ComponentType<any>; className?: string }) => {
    const isActive = pathname === href;
    const isFavorites = href === '/favorites';
    const favCount = favorites.length;
    
    return (
      <Link
        href={href}
        className={cn(
          'text-foreground/70 transition-colors hover:text-foreground relative flex items-center gap-2',
          isActive && 'text-foreground font-semibold',
          className
        )}
        onClick={() => setSheetOpen(false)}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {label}
        {isFavorites && favCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
            {favCount}
          </span>
        )}
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
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserCog className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
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
    <MotionConfig transition={{ ease: [0.16, 1, 0.3, 1] }}>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60" data-animate="fade" data-animate-delay="0.05" data-animate-distance="16">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center">
            <Reveal as="div" className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-bold font-headline text-xl sm:inline-block">
                    {siteConfig?.title || 'Lar Feliz Animal'}
                </span>
              </Link>
            </Reveal>
          </div>
          <nav className="hidden md:flex flex-1 items-center text-sm font-medium">
            <StaggerContainer className="flex flex-1 items-center justify-end gap-6" stagger={0.08}>
              {navItems.map((item) => (
                <Reveal as="span" key={item.href} delay={0.05}>
                  <NavLink {...item} />
                </Reveal>
              ))}
            </StaggerContainer>
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Reveal as="span" delay={0.1}>
              <ThemeToggle />
            </Reveal>
            <Reveal as="span" delay={0.12}>
              <UserNav />
            </Reveal>
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden px-2">
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
                    <StaggerContainer className="flex flex-col space-y-4" stagger={0.1}>
                      {navItems.map((item) => (
                        <Reveal as="span" key={item.href}>
                          <NavLink {...item} />
                        </Reveal>
                      ))}
                      {isAdmin && (
                        <Reveal as="span">
                          <NavLink href="/admin" label="Painel Admin" />
                        </Reveal>
                      )}
                    </StaggerContainer>
                  </nav>
                  <div className="mt-auto p-4 border-t">
                    {user ? (
                      <Reveal as="div" className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.photoURL || ''} />
                          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.displayName}</p>
                          <Button variant="link" className="p-0 h-auto text-muted-foreground" onClick={() => { handleSignOut(); setSheetOpen(false); }}>Sair</Button>
                        </div>
                      </Reveal>
                    ) : (
                      <StaggerContainer className="flex flex-col space-y-2" stagger={0.1}>
                        <Reveal as="span">
                          <Button asChild className="w-full" onClick={() => setSheetOpen(false)}>
                            <Link href="/login">Login</Link>
                          </Button>
                        </Reveal>
                        <Reveal as="span">
                          <Button variant="outline" asChild className="w-full" onClick={() => setSheetOpen(false)}>
                            <Link href="/register">Cadastre-se</Link>
                          </Button>
                        </Reveal>
                      </StaggerContainer>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </MotionConfig>
  );
}
