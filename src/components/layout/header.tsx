'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, User, LogOut, Shield, UserCog, Heart, HandHeart } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useSupportModal } from '@/hooks/use-support-modal';

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
import { SimpleAvatar } from '@/components/ui/simple-avatar';
import { syncUserSession } from '@/lib/client-auth-session';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


const navItems = [
  { href: '/', label: 'Início' },
  { href: '/adopt', label: 'Adotar' },
  { href: '/temporary', label: 'Lar Temporário' },
  { href: '/matcher', label: 'Encontrar Match' },
  { href: '/education', label: 'Educação' },
  { href: '/shelters', label: 'Abrigos' },
  { href: '/favorites', label: 'Favoritos', icon: Heart },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const { hasReadModal, markAsRead } = useSupportModal();
  const { user, loading } = useUser();
  const { favorites } = useFavorites();
  const firestore = useFirestore();
  const auth = getAuth();
  
  const userDocRef = useMemo(() => (firestore && user ? (doc(firestore, 'users', user.uid) as DocumentReference<AppUser>) : null), [firestore, user]);
  const { data: appUser } = useDoc<AppUser>(userDocRef);

  const configRef = useMemo(() => (firestore ? (doc(firestore, 'config', 'site') as DocumentReference<SiteConfig>) : null), [firestore]);
  const { data: siteConfig } = useDoc<SiteConfig>(configRef);
  
  const isAdmin = appUser?.role === 'operator';

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } finally {
      await syncUserSession(null);
    }
  };

  const NavLink = ({ href, label, icon: Icon, className }: { href: string; label: string; icon?: React.ComponentType<any>; className?: string }) => {
    const isActive = pathname === href;
    const isFavorites = href === '/favorites';
    const isTemporary = href === '/temporary';
    const favCount = favorites.length;
    
    const handleClick = (e: React.MouseEvent) => {
      if (isTemporary && !hasReadModal) {
        e.preventDefault();
        setShowSupportModal(true);
        setSheetOpen(false);
        return;
      }
      setSheetOpen(false);
    };
    
    return (
      <Link
        href={href}
        className={cn(
          'text-foreground/70 transition-colors hover:text-foreground relative flex items-center gap-2',
          isActive && 'text-foreground font-semibold',
          className
        )}
        onClick={handleClick}
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
      const userInitial = (user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase();
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <SimpleAvatar
                src={user.photoURL}
                alt={user.displayName || 'Usuário'}
                fallback={userInitial}
                className="h-9 w-9"
              />
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
            <DropdownMenuItem onClick={() => { void handleSignOut(); }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
        <div className="flex items-center space-x-2">
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
      <div className="flex h-16 items-center px-2 md:px-6 max-w-full">
        <div className="mr-2 md:mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-1.5 md:space-x-2">
            <Logo width={32} height={32} className="md:w-9 md:h-9" />
            <span className="font-bold font-headline text-base md:text-xl">
                {siteConfig?.title || 'Lar Feliz Animal'}
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className="ml-auto flex items-center justify-end space-x-0.5 md:space-x-2">
          <ThemeToggle />
          <UserNav />
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden px-1.5">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background/95 backdrop-blur-sm p-0">
                <SheetTitle className="sr-only">Menu Principal</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
             <Link href="/" className="flex items-center space-x-2" onClick={() => setSheetOpen(false)}>
                      <Logo width={32} height={32} />
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
                       <SimpleAvatar
                         src={user.photoURL}
                         alt={user.displayName || 'Usuário'}
                         fallback={(user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                       />
                       <div>
                         <p className="font-semibold">{user.displayName}</p>
                         <Button variant="link" className="p-0 h-auto text-muted-foreground" onClick={() => { void handleSignOut(); setSheetOpen(false); }}>Sair</Button>
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

      {/* Support Modal */}
      <Dialog open={showSupportModal} onOpenChange={(open) => {
        if (!open) {
          markAsRead();
        }
        setShowSupportModal(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <HandHeart className="h-10 w-10 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center font-headline">
              Quer nos apoiar?
            </DialogTitle>
            <div className="text-base text-center pt-4 space-y-4">
              <p className="leading-relaxed">
                <strong className="text-foreground">O que é o Lar Temporário?</strong>
              </p>
              <p className="leading-relaxed">
                A pessoa apenas acolheria o animal, para que ele se mantesse seguro até encontrar um lar definitivo.
              </p>
              <p className="leading-relaxed">
                Quando você se oferece como lar temporário, <strong className="text-foreground">não tem gasto algum</strong>. Nós enviamos ração, medicamentos e arcamos com veterinário.
              </p>
              <p className="leading-relaxed">
                Você apenas acolhe o animalzinho para que ele possa achar um lar definitivo, criando uma <strong className="text-foreground">rede de apoio</strong> essencial para salvar vidas!
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3">
            <Button variant="outline" onClick={() => {
              markAsRead();
              setShowSupportModal(false);
            }}>
              Fechar
            </Button>
            <Button asChild size="lg" onClick={() => {
              markAsRead();
              setShowSupportModal(false);
            }}>
              <Link href="/temporary">
                <HandHeart className="mr-2 h-5 w-5" />
                Ver Animais Temporários
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
