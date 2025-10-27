'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';
import { Github, Twitter, Instagram, Youtube, Linkedin, Facebook } from 'lucide-react';
import type { SiteConfig, SocialLink } from '@/lib/types';
import { Logo } from '@/components/icons/logo';

const iconMap: Record<SocialLink['platform'], React.FC<React.ComponentProps<'svg'>>> = {
    GitHub: Github,
    Twitter: Twitter,
    Instagram: Instagram,
    YouTube: Youtube,
    LinkedIn: Linkedin,
    Facebook: Facebook,
}


export function Footer() {
  const firestore = useFirestore();

  const configRef = useMemo(() => (firestore ? (doc(firestore, 'config', 'site') as DocumentReference<SiteConfig>) : null), [firestore]);
  const { data: siteConfig } = useDoc<SiteConfig>(configRef);

  const socialLinks = siteConfig?.socialLinks?.slice(0, 4) || [];

  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo e descrição */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-xl">{siteConfig?.title || 'Lar Feliz Animal'}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Conectamos corações, um focinho de cada vez. Adote um pet e mude uma vida.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/adopt" className="hover:text-foreground transition-colors">Adotar</Link></li>
              <li><Link href="/matcher" className="hover:text-foreground transition-colors">Encontrar Match</Link></li>
              <li><Link href="/education" className="hover:text-foreground transition-colors">Educação</Link></li>
              <li><Link href="/shelters" className="hover:text-foreground transition-colors">Abrigos</Link></li>
              <li><Link href="/favorites" className="hover:text-foreground transition-colors">Favoritos</Link></li>
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h3 className="font-semibold mb-4">Sobre</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacidade</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-semibold mb-4">Conecte-se</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Siga-nos para atualizações e histórias inspiradoras!
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((link) => {
                  const IconComponent = iconMap[link.platform];
                  return (
                    <Link 
                      key={link.platform} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {IconComponent && <IconComponent className="h-6 w-6" />}
                      <span className="sr-only">{link.platform}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig?.title || 'Lar Feliz Animal'}. Todos os direitos reservados.</p>
          <p className="mt-1">Feito com ❤️ para nossos amigos de quatro patas.</p>
        </div>
      </div>
    </footer>
  );
}
