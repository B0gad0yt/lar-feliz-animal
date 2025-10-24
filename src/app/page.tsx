import Image from 'next/image';
import Link from 'next/link';
import { PawPrint, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-dog-1');

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative text-center">
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
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
            Encontre seu amigo para sempre
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-md">
            Conectamos corações, um focinho de cada vez. Adote um pet e mude uma vida.
          </p>
          <Button asChild size="lg" className="mt-8 font-bold text-lg">
            <Link href="/adopt">Adote Agora</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit">
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
          </Card>

          <Card className="text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit">
                <Heart className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline pt-4">Match Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Nossa ferramenta de IA sugere os pets que mais combinam com seu
                estilo de vida e preferências. Encontre o par perfeito!
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/matcher">Encontrar Meu Match</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit">
                <BookOpen className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline pt-4">Educação e Consciência</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Aprenda sobre a posse responsável e as consequências do abandono
                com artigos e explicações geradas por IA.
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link href="/education">Saber Mais</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
