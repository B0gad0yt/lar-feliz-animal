import Link from 'next/link';
import { Github, Twitter, Instagram } from 'lucide-react';
import { Logo } from '@/components/icons/logo';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-bold font-headline text-xl">Lar Feliz Animal</span>
        </div>
        <div className="text-center text-sm text-muted-foreground mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} Lar Feliz Animal. Todos os direitos reservados.</p>
          <p>Feito com ❤️ para nossos amigos de quatro patas.</p>
        </div>
        <div className="flex space-x-4">
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Github className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Twitter className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
