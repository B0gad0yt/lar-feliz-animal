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
    <Card className="overflow-hidden flex flex-col group bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative w-full h-56">
          {image && (
            <Image
              src={image.imageUrl}
              alt={animal.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
        <div className="p-4 pb-0">
           <CardTitle className="font-headline text-2xl">{animal.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary">{animal.breed}</Badge>
            <Badge variant="secondary">{animal.age} {animal.age > 1 ? 'anos' : 'ano'}</Badge>
            <Badge variant="secondary">{animal.size}</Badge>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {animal.description}
        </p>
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
