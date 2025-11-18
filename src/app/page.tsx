'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PawPrint, Heart, BookOpen, Users, Sparkles, ShieldCheck, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { StaggerContainer } from '@/components/animations/stagger-container';
import { Reveal } from '@/components/animations/reveal';
import { SupportModal } from '@/components/support-modal';
import { useSupportModal } from '@/hooks/use-support-modal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check } from 'lucide-react';

export default function Home() {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const { hasReadModal, markAsRead } = useSupportModal();
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-dog-1');
  const highlights = [
    {
      icon: Users,
      title: 'Comunidade acolhedora',
      description: 'Mais de 120 adoções concluídas com acompanhamento de voluntários.',
    },
    {
      icon: ShieldCheck,
      title: 'Processo seguro',
      description: 'Triagem responsável, visitas supervisionadas e suporte contínuo aos tutores.',
    },
    {
      icon: Sparkles,
      title: 'Experiência personalizada',
      description: 'Recomendações inteligentes que alinham estilo de vida, personalidade e rotina.',
    },
  ];
  const formattedAdoptions = new Intl.NumberFormat('pt-BR').format(120);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section
        className="relative w-full min-h-[75vh] md:min-h-[85vh] text-white"
        data-animate="off"
        data-motion="manual"
      >
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover object-center hero-image"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full px-4 py-16 md:py-24">
          <StaggerContainer
            className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center md:items-start md:text-left"
            stagger={0.2}
          >
            <Reveal
              as="span"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.3em]"
            >
              Cuidando de vidas há mais de 10 anos
            </Reveal>
            <Reveal as="h1" className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
              Encontre seu amigo para sempre
            </Reveal>
            <Reveal as="p" delay={0.1} className="max-w-2xl text-lg md:text-2xl drop-shadow-md">
              Somos uma ponte entre protetores dedicados e tutores responsáveis. Cada adoção conta com orientação
              personalizada, suporte emocional e recursos gratuitos para garantir uma adaptação feliz.
            </Reveal>
            <Reveal
              as="div"
              delay={0.2}
              className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row md:items-center md:gap-6"
            >
              <Button asChild size="lg" className="font-bold text-lg py-6 px-8">
                <Link href="/adopt">Adote Agora</Link>
              </Button>
              <Button 
                size="lg" 
                variant="secondary" 
                className="font-semibold text-lg py-6 px-8"
                asChild={hasReadModal}
                onClick={() => {
                  if (hasReadModal) {
                    // Se já leu, vai direto para a página
                    return;
                  }
                  setShowSupportModal(true);
                }}
              >
                {hasReadModal ? (
                  <Link href="/temporary">
                    <HandHeart className="mr-2 h-5 w-5" />
                    Quer nos apoiar?
                  </Link>
                ) : (
                  <>
                    <HandHeart className="mr-2 h-5 w-5" />
                    Quer nos apoiar?
                  </>
                )}
              </Button>
            </Reveal>
            <Reveal as="p" delay={0.25} className="text-sm md:text-base text-white/80">
              Já ajudamos {formattedAdoptions} famílias a encontrarem seus companheiros ideais.
            </Reveal>
            <StaggerContainer className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
              {highlights.map(({ icon: Icon, title, description }) => (
                <Reveal
                  key={title}
                  className="rounded-2xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur-md"
                >
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-headline text-lg font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-white/80">{description}</p>
                </Reveal>
              ))}
            </StaggerContainer>
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4" data-animate="off" data-motion="manual">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.25}>
          <Reveal as="article" className="text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit float-soft">
                <PawPrint className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline pt-4">Navegue pelos Perfis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Explore perfis detalhados com fotos, histórias e personalidades
                de cada animalzinho esperando por um lar.
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/adopt">Ver Animais</Link>
              </Button>
            </CardContent>
          </Reveal>

          <Reveal as="article" delay={0.1} className="text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit float-soft">
                <Heart className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline pt-4">Filtro Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Use nossos filtros para encontrar os pets que mais combinam com seu
                estilo de vida e preferências. Encontre o par perfeito!
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/matcher">Encontrar Meu Match</Link>
              </Button>
            </CardContent>
          </Reveal>

          <Reveal as="article" delay={0.2} className="text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit float-soft">
                <BookOpen className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline pt-4">Educação e Consciência</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Aprenda sobre a posse responsável e as consequências do abandono
                em nossa seção educativa.
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/education">Saber Mais</Link>
              </Button>
            </CardContent>
          </Reveal>
        </StaggerContainer>
      </section>

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
            <Button asChild size="lg" onClick={() => markAsRead()}>
              <Link href="/temporary">
                <HandHeart className="mr-2 h-5 w-5" />
                Ver Animais Temporários
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SupportModal />
    </div>
  );
}