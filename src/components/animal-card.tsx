'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Animal } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const image = animal.photos[0];
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(animal.id || '');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(animal.id || '');
  };

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
    <Card className="overflow-hidden flex flex-col bg-card/70 backdrop-blur-sm border-0 shadow-lg transition-shadow duration-300 ease-in-out group-hover:shadow-2xl">
      <CardHeader className="p-0">
        <div className="relative w-full h-56 overflow-hidden">
          {image && (
            <Image
              src={image}
              alt={animal.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          )}
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300",
              favorited 
                ? "bg-primary/90 text-primary-foreground scale-110" 
                : "bg-background/70 text-foreground hover:bg-background/90 hover:scale-110"
            )}
            aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                favorited && "fill-current"
              )} 
            />
          </button>
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
    </motion.article>
  );
}
