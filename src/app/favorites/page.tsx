'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, documentId } from 'firebase/firestore';
import type { CollectionReference } from 'firebase/firestore';
import type { Animal } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { AnimalCard } from '@/components/animal-card';
import { Card } from '@/components/ui/card';
import { Heart, PawPrint } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FavoritesPage() {
  const firestore = useFirestore();
  const { favorites } = useFavorites();

  // Create query to fetch favorite animals
  const favoritesQuery = useMemo(() => {
    if (!firestore || favorites.length === 0) return null;
    
    // Firestore 'in' operator has a limit of 10 items, so we need to chunk if more
    const favoritesToFetch = favorites.slice(0, 10);
    
    return query(
      collection(firestore, 'animals') as CollectionReference<Animal>,
      where(documentId(), 'in', favoritesToFetch)
    );
  }, [firestore, favorites]);

  const { data: favoriteAnimals, loading } = useCollection<Animal>(favoritesQuery);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <Skeleton className="w-full h-56" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold flex items-center justify-center gap-3">
          <Heart className="h-10 w-10 text-primary fill-primary" />
          Meus Favoritos
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Animais que você salvou para adotar depois
        </p>
      </header>

      <main>
        {loading ? (
          renderSkeleton()
        ) : favorites.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/70 backdrop-blur-sm shadow-lg">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Nenhum favorito ainda</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Explore nossos animais disponíveis e clique no coração para adicionar aos seus favoritos!
            </p>
            <Button asChild className="mt-6">
              <Link href="/adopt">Explorar Animais</Link>
            </Button>
          </Card>
        ) : favoriteAnimals && favoriteAnimals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/70 backdrop-blur-sm shadow-lg">
            <PawPrint className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Carregando favoritos...</h3>
          </Card>
        )}

        {favorites.length > 10 && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Mostrando os primeiros 10 favoritos de {favorites.length} no total.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
