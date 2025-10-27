import Image from 'next/image';
import Link from 'next/link';
import { PawPrint, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { StaggerContainer } from '@/components/animations/stagger-container';
import { Reveal } from '@/components/animations/reveal';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-dog-1');

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
  <section className="w-full relative text-center overflow-hidden" data-animate="off" data-motion="manual">
        <div className="relative w-full h-[60vh] md:h-[70vh]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <StaggerContainer className="flex flex-col items-center" stagger={0.2}>
            <Reveal as="h1" className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg text-center">
              Encontre seu amigo para sempre
            </Reveal>
            <Reveal
              as="p"
              delay={0.1}
              className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-md text-center"
            >
              Conectamos corações, um focinho de cada vez. Adote um pet e mude uma vida.
            </Reveal>
            <Reveal as="div" delay={0.2} className="mt-8">
              <Button asChild size="lg" className="font-bold text-lg py-6 px-8">
                <Link href="/adopt">Adote Agora</Link>
              </Button>
            </Reveal>
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
    </div>
  );
}
