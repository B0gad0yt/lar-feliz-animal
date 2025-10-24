'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Github, Twitter, Instagram, Youtube, Linkedin, Facebook, icons } from 'lucide-react';
import type { SiteConfig, SocialLink } from '@/lib/types';
import { Logo } from '@/components/icons/logo';

const iconMap: Record<SocialLink['platform'], React.FC<React.ComponentProps<'svg'>>> = {
    GitHub: Github,
    Twitter: Twitter,
    Instagram: Instagram,
    YouTube: Youtube,
    LinkedIn: Linkedin,
    Facebook: Facebook,
    TikTok: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path><path d="M12 15a7 7 0 0 0 7 7h-1a7 7 0 0 0-7-7v0a7 7 0 0 0-7 7H4a7 7 0 0 0 7-7z"></path><path d="M12 12V2"></path></svg>,
}


export function Footer() {
  const firestore = useFirestore();

  const configRef = useMemo(() => firestore ? doc(firestore, 'config', 'site') : null, [firestore]);
  const { data: siteConfig } = useDoc<SiteConfig>(configRef);

  const socialLinks = siteConfig?.socialLinks?.slice(0, 4) || [];

  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-bold font-headline text-xl">{siteConfig?.title || 'Lar Feliz Animal'}</span>
        </div>
        <div className="text-center text-sm text-muted-foreground mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} {siteConfig?.title || 'Lar Feliz Animal'}. Todos os direitos reservados.</p>
          <p>Feito com ❤️ para nossos amigos de quatro patas.</p>
        </div>
        
        {socialLinks.length > 0 && (
            <div className="flex space-x-4">
            {socialLinks.map((link) => {
                const IconComponent = iconMap[link.platform];
                return (
                    <Link key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        {IconComponent && <IconComponent className="h-6 w-6" />}
                        <span className="sr-only">{link.platform}</span>
                    </Link>
                )
            })}
            </div>
        )}
      </div>
    </footer>
  );
}
