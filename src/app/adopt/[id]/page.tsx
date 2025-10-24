'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PawPrint, Heart, Stethoscope, Home, Calendar, Bone, Cat } from 'lucide-react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Animal, Shelter } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnimalProfilePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const animalRef = firestore ? doc(firestore, 'animals', params.id) : null;
  const { data: animal, loading: animalLoading } = useDoc<Animal>(animalRef);
  
  const shelterRef = firestore && animal ? doc(firestore, 'shelters', animal.shelterId) : null;
  const { data: shelter, loading: shelterLoading } = useDoc<Shelter>(shelterRef);
  
  const animalImages = animal?.photos.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);

  const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start">
      <div className="text-primary mr-4 mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );

  if (animalLoading || shelterLoading) {
      return (
          <div className="container mx-auto max-w-5xl py-12 px-4">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                  <Skeleton className="w-full aspect-square rounded-lg"/>
                  <div className="flex flex-col space-y-6">
                      <Skeleton className="h-12 w-3/4"/>
                      <Skeleton className="h-6 w-1/2"/>
                      <Skeleton className="h-32 w-full"/>
                      <Skeleton className="h-20 w-full"/>
                      <Skeleton className="h-20 w-full"/>
                      <Skeleton className="h-12 w-full"/>
                  </div>
              </div>
          </div>
      )
  }

  if (!animal) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col">
          <Carousel className="w-full rounded-lg overflow-hidden shadow-lg">
            <CarouselContent>
              {animalImages && animalImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full aspect-square">
                    {image && <Image src={image.imageUrl} alt={`${animal.name} - Foto ${index + 1}`} fill className="object-cover" data-ai-hint={image.imageHint} />}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="flex flex-col space-y-6">
          <header>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">{animal.name}</h1>
            <p className="text-xl text-muted-foreground mt-1">{animal.breed}</p>
          </header>

          <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                <InfoCard icon={animal.species === 'Gato' ? <Cat /> : <Bone />} title="Espécie">
                    {animal.species}
                </InfoCard>
                <InfoCard icon={<Calendar />} title="Idade">
                    {animal.age} {animal.age > 1 ? 'anos' : 'ano'}
                </InfoCard>
                <InfoCard icon={<PawPrint />} title="Tamanho">
                    {animal.size}
                </InfoCard>
                <InfoCard icon={animal.gender === 'Fêmea' ? <Heart /> : <PawPrint />} title="Sexo">
                    {animal.gender}
                </InfoCard>
                {shelter && (
                    <InfoCard icon={<Home />} title="Abrigo">
                        {shelter.name}
                    </InfoCard>
                )}
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-2xl font-headline font-semibold mb-2">Sobre {animal.name}</h2>
            <p className="text-foreground/80">{animal.description}</p>
          </div>

          <div>
             <h2 className="text-2xl font-headline font-semibold mb-2">Nossa História</h2>
             <p className="text-foreground/80">{animal.story}</p>
          </div>

          <div>
            <h2 className="text-2xl font-headline font-semibold mb-3">Personalidade</h2>
            <div className="flex flex-wrap gap-2">
              {animal.personality.map((trait) => (
                <Badge key={trait} variant="outline" className="text-base px-3 py-1 bg-accent/30 border-accent">{trait}</Badge>
              ))}
            </div>
          </div>
          
          <div>
             <h2 className="text-2xl font-headline font-semibold mb-3 flex items-center"><Stethoscope className="mr-2 h-6 w-6"/>Saúde</h2>
             <div className="flex flex-wrap gap-2">
                {animal.health.map((item) => (
                  <Badge key={item} variant="secondary" className="text-base">{item}</Badge>
                ))}
             </div>
          </div>

          <Button asChild size="lg" className="w-full py-6 text-lg font-bold">
            <Link href={`/adopt/${animal.id}/apply`}>
              <Heart className="mr-2 h-5 w-5"/> Quero Adotar {animal.name}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
