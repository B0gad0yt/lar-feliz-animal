'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CollectionReference } from 'firebase/firestore';
import type { Animal } from '@/lib/types';
import { temperamentOptions } from '@/lib/data';

import { AnimalCard } from '@/components/animal-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, PawPrint } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function MatcherPage() {
  const firestore = useFirestore();
  const animalsQuery = useMemo(() => (firestore ? (collection(firestore, 'animals') as CollectionReference<Animal>) : null), [firestore]);
  const { data: animals, loading: animalsLoading } = useCollection<Animal>(animalsQuery);

  const [selectedTemperaments, setSelectedTemperaments] = useState<string[]>([]);

  const handleTemperamentChange = (temperamentId: string) => {
    setSelectedTemperaments(prev =>
      prev.includes(temperamentId)
        ? prev.filter(t => t !== temperamentId)
        : [...prev, temperamentId]
    );
  };
  
  const matches = useMemo(() => {
    if (!animals) return [];
    if (selectedTemperaments.length === 0) return animals;
    
    return animals.filter(animal =>
        selectedTemperaments.every(t => animal.personality.includes(t))
    );
  }, [animals, selectedTemperaments]);


  const renderSkeleton = () => (
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
            <Card key={i}>
                <Skeleton className="w-full h-56" />
                <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        ))}
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline flex items-center justify-center">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 mr-4 text-primary" />
            Encontre seu Match Perfeito
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 ml-4 text-primary" />
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Selecione as características de personalidade que você busca em um amigo.
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg sticky top-24 transition-all duration-300">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Temperamento Desejado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {temperamentOptions.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={item.id}
                            checked={selectedTemperaments.includes(item.id)}
                            onCheckedChange={() => handleTemperamentChange(item.id)}
                        />
                        <Label htmlFor={item.id} className="font-normal cursor-pointer">{item.label}</Label>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold font-headline mb-4">Resultados ({matches.length})</h2>
            {animalsLoading ? renderSkeleton() : (
                matches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in-50 duration-500">
                        {matches.map(animal => (
                            <AnimalCard key={animal.id} animal={animal} />
                        ))}
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg min-h-[30rem] transition-all duration-300 ease-in-out">
                        <PawPrint className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">Nenhum animal encontrado</h3>
                        <p className="text-muted-foreground mt-2">
                            Tente selecionar menos filtros para encontrar seu novo amigo.
                        </p>
                    </Card>
                )
            )}
        </div>
      </div>
    </div>
  );
}

    
