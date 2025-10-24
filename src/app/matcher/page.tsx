'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { animals } from '@/lib/data';
import type { Animal } from '@/lib/types';
import { temperamentOptions } from '@/lib/data';

import { AnimalCard } from '@/components/animal-card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, PawPrint } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';


const matcherSchema = z.object({
  species: z.string().optional(),
  size: z.string().optional(),
  age: z.string().optional(),
  temperament: z.array(z.string()).optional(),
});

export default function MatcherPage() {
  const [matches, setMatches] = useState<Animal[]>(animals);

  const form = useForm<z.infer<typeof matcherSchema>>({
    resolver: zodResolver(matcherSchema),
    defaultValues: {
      species: 'Qualquer',
      size: 'Qualquer',
      age: 'Qualquer',
      temperament: [],
    },
  });

  const watchAllFields = form.watch();

  useEffect(() => {
    const applyFilters = () => {
      const { species, size, age, temperament } = form.getValues();
      let tempAnimals = [...animals];

      if (species && species !== 'Qualquer') {
        tempAnimals = tempAnimals.filter(animal => animal.species === species);
      }
      if (size && size !== 'Qualquer') {
        tempAnimals = tempAnimals.filter(animal => animal.size === size);
      }
      if (age && age !== 'Qualquer') {
        if(age === 'Filhote') tempAnimals = tempAnimals.filter(animal => animal.age <= 1);
        if(age === 'Adulto') tempAnimals = tempAnimals.filter(animal => animal.age > 1 && animal.age < 8);
        if(age === 'Idoso') tempAnimals = tempAnimals.filter(animal => animal.age >= 8);
      }
      if (temperament && temperament.length > 0) {
        tempAnimals = tempAnimals.filter(animal => 
          temperament.every(t => animal.personality.includes(t))
        );
      }
      
      setMatches(tempAnimals);
    };

    applyFilters();
  }, [watchAllFields, form]);


  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline flex items-center justify-center">
            <Sparkles className="w-10 h-10 mr-4 text-primary" />
            Encontre seu Match Perfeito
            <Sparkles className="w-10 h-10 ml-4 text-primary" />
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Use os filtros para encontrar os amigos mais compatíveis com você.
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg sticky top-24 transition-all duration-300">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Filtre suas preferências</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <div>
                    <FormLabel>Preferências</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                        <FormField control={form.control} name="species" render={({ field }) => (
                             <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Qualquer">Espécie</SelectItem><SelectItem value="Cachorro">Cachorro</SelectItem><SelectItem value="Gato">Gato</SelectItem><SelectItem value="Coelho">Coelho</SelectItem></SelectContent></Select>
                        )} />
                         <FormField control={form.control} name="size" render={({ field }) => (
                             <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Qualquer">Tamanho</SelectItem><SelectItem value="Pequeno">Pequeno</SelectItem><SelectItem value="Médio">Médio</SelectItem><SelectItem value="Grande">Grande</SelectItem></SelectContent></Select>
                        )} />
                         <FormField control={form.control} name="age" render={({ field }) => (
                             <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Qualquer">Idade</SelectItem><SelectItem value="Filhote">Filhote (até 1 ano)</SelectItem><SelectItem value="Adulto">Adulto (1-7 anos)</SelectItem><SelectItem value="Idoso">Idoso (8+ anos)</SelectItem></SelectContent></Select>
                        )} />
                    </div>
                  </div>
                   <FormField
                    control={form.control}
                    name="temperament"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Que tipo de temperamento você busca?</FormLabel>
                          <FormDescription>Marque todas que se aplicam.</FormDescription>
                          <FormMessage />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {temperamentOptions.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="temperament"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold font-headline mb-4">Resultados</h2>
            {matches.length > 0 ? (
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
                        Tente ajustar seus filtros para encontrar seu novo amigo.
                    </p>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
