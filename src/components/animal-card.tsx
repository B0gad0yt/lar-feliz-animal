import Image from 'next/image';
import Link from 'next/link';
import type { Animal } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === animal.photos[0]);

  return (
    <Card className="overflow-hidden flex flex-col group bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative w-full h-56 overflow-hidden">
          {image && (
            <Image
              src={image.imageUrl}
              alt={animal.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
        <div className="p-4 pb-0">
           <CardTitle className="font-headline text-2xl">{animal.name}</CardTitle>
           <p className="text-sm text-muted-foreground">{animal.breed}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">{animal.age} {animal.age > 1 ? 'anos' : 'ano'}</Badge>
            <Badge variant="secondary">{animal.size}</Badge>
            <Badge variant="secondary">{animal.gender}</Badge>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 h-[2.5rem] mb-3">
          {animal.description}
        </p>
         <div className="flex flex-wrap gap-1">
          {animal.personality.slice(0, 3).map((trait) => (
            <Badge key={trait} variant="outline" className="text-xs bg-accent/20 border-accent/50">{trait}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/adopt/${animal.id}`}>
            Conhecer {animal.name}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
