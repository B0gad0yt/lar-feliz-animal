'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Animal } from '@/lib/types';
import { AnimalCard } from '@/components/animal-card';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent as SelectContentComponent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, PawPrint } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdoptPage() {
  const firestore = useFirestore();
  const animalsQuery = useMemo(() => firestore ? collection(firestore, 'animals') : null, [firestore]);
  const { data: animals, loading: animalsLoading } = useCollection<Animal>(animalsQuery);

  const [filters, setFilters] = useState({
    search: '',
    species: 'all',
    size: 'all',
    gender: 'all',
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
  };

  const filteredAnimals = useMemo(() => {
    if (!animals) return [];
    
    return animals.filter(animal => {
        const searchMatch = filters.search 
            ? animal.name.toLowerCase().includes(filters.search.toLowerCase()) ||
              animal.breed.toLowerCase().includes(filters.search.toLowerCase())
            : true;
        const speciesMatch = filters.species !== 'all' ? animal.species === filters.species : true;
        const sizeMatch = filters.size !== 'all' ? animal.size === filters.size : true;
        const genderMatch = filters.gender !== 'all' ? animal.gender === filters.gender : true;
        
        return searchMatch && speciesMatch && sizeMatch && genderMatch;
    });
  }, [animals, filters]);
  
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Adote um Amigo</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Veja os animais incríveis que estão esperando por um lar.
        </p>
      </header>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <Card className="p-4 bg-card/70 backdrop-blur-sm shadow-lg sticky top-24">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filtros
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Pesquisar</Label>
                <Input
                  id="search"
                  placeholder="Nome ou raça..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="species">Espécie</Label>
                <Select value={filters.species} onValueChange={(value) => handleFilterChange('species', value)}>
                  <SelectTrigger id="species">
                    <SelectValue placeholder="Espécie" />
                  </SelectTrigger>
                  <SelectContentComponent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Cachorro">Cachorro</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Coelho">Coelho</SelectItem>
                  </SelectContentComponent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">Tamanho</Label>
                <Select value={filters.size} onValueChange={(value) => handleFilterChange('size', value)}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Tamanho" />
                  </SelectTrigger>
                  <SelectContentComponent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Pequeno">Pequeno</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Grande">Grande</SelectItem>
                  </SelectContentComponent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gender">Sexo</Label>
                <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Sexo" />
                  </SelectTrigger>
                  <SelectContentComponent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                  </SelectContentComponent>
                </Select>
              </div>
            </div>
          </Card>
        </aside>
        <main className="w-full md:w-3/4">
          {animalsLoading ? renderSkeleton() : (
            filteredAnimals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnimals.map((animal) => (
                    <AnimalCard key={animal.id} animal={animal} />
                ))}
                </div>
            ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/70 backdrop-blur-sm shadow-lg">
                    <PawPrint className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Nenhum animal encontrado</h3>
                    <p className="text-muted-foreground mt-2">
                        Tente ajustar seus filtros para encontrar seu novo amigo.
                    </p>
                </Card>
            )
          )}
        </main>
      </div>
    </div>
  );
}