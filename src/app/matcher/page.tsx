'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { suggestAnimalMatches } from '@/ai/flows/suggest-animal-matches';
import { animals, shelters } from '@/lib/data';
import type { Animal } from '@/lib/types';

import { AnimalCard } from '@/components/animal-card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Heart, Sparkles, PawPrint } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const matcherSchema = z.object({
  lifestyle: z.string().min(1, 'Selecione seu nível de atividade.'),
  livingSituation: z.string().min(1, 'Selecione seu tipo de moradia.'),
  family: z.string().min(1, 'Descreva sua família ou quem mora com você.'),
  preferences: z.object({
    species: z.string().optional(),
    size: z.string().optional(),
    age: z.string().optional(),
  }),
  temperament: z.string().min(1, 'Descreva o temperamento que você busca.'),
});

export default function MatcherPage() {
  const [matches, setMatches] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof matcherSchema>>({
    resolver: zodResolver(matcherSchema),
    defaultValues: {
      preferences: { species: 'Qualquer', size: 'Qualquer', age: 'Qualquer' },
    },
  });

  async function onSubmit(values: z.infer<typeof matcherSchema>) {
    setIsLoading(true);
    setError('');
    setMatches([]);
    
    const lifestyle = `Nível de atividade: ${values.lifestyle}. Moradia: ${values.livingSituation}. Família: ${values.family}.`;
    const preferences = `Espécie: ${values.preferences.species}, Tamanho: ${values.preferences.size}, Idade: ${values.preferences.age}. Temperamento desejado: ${values.temperament}.`;
    
    const animalProfiles = animals.map(a => {
        const shelter = shelters.find(s => s.id === a.shelterId);
        return `ID: ${a.id}, Nome: ${a.name}, Espécie: ${a.species}, Raça: ${a.breed}, Idade: ${a.age}, Tamanho: ${a.size}, Sexo: ${a.gender}, Personalidade: ${a.personality.join(', ')}. Abrigo: ${shelter?.name}. Descrição: ${a.description}`;
    });

    try {
      const result = await suggestAnimalMatches({ lifestyle, preferences, animalProfiles });
      const matchedAnimals = result.matchIds
        .map(id => animals.find(a => a.id === id))
        .filter((a): a is Animal => a !== undefined && a !== null);
      
      setMatches(matchedAnimals);
    } catch (e) {
      setError('Não foi possível encontrar seu match. Tente novamente.');
      console.error(e);
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline flex items-center justify-center">
            <Sparkles className="w-10 h-10 mr-4 text-primary" />
            Encontre seu Match Perfeito
            <Sparkles className="w-10 h-10 ml-4 text-primary" />
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Responda algumas perguntas e nossa IA encontrará os amigos mais compatíveis com você.
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg sticky top-24 transition-all duration-300">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Conte-nos sobre você</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="lifestyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qual seu nível de atividade?</FormLabel>
                        <RadioGroup onValueChange={field.onChange} className="flex gap-4">
                          <FormItem><FormControl><RadioGroupItem value="Calmo" id="r1" /></FormControl><Label htmlFor="r1" className="ml-2">Calmo</Label></FormItem>
                          <FormItem><FormControl><RadioGroupItem value="Moderado" id="r2" /></FormControl><Label htmlFor="r2" className="ml-2">Moderado</Label></FormItem>
                          <FormItem><FormControl><RadioGroupItem value="Ativo" id="r3" /></FormControl><Label htmlFor="r3" className="ml-2">Ativo</Label></FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="livingSituation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Onde você mora?</FormLabel>
                        <RadioGroup onValueChange={field.onChange} className="flex gap-4">
                           <FormItem><FormControl><RadioGroupItem value="Apartamento" id="ls1" /></FormControl><Label htmlFor="ls1" className="ml-2">Apto</Label></FormItem>
                           <FormItem><FormControl><RadioGroupItem value="Casa sem quintal" id="ls2" /></FormControl><Label htmlFor="ls2" className="ml-2">Casa s/ quintal</Label></FormItem>
                           <FormItem><FormControl><RadioGroupItem value="Casa com quintal" id="ls3" /></FormControl><Label htmlFor="ls3" className="ml-2">Casa c/ quintal</Label></FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="family"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Com quem você mora?</FormLabel>
                        <FormControl><Input placeholder="Ex: Sozinho, com casal e 2 crianças" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormLabel>Preferências (opcional)</FormLabel>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <FormField control={form.control} name="preferences.species" render={({ field }) => (
                             <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Qualquer">Espécie</SelectItem><SelectItem value="Cachorro">Cachorro</SelectItem><SelectItem value="Gato">Gato</SelectItem></SelectContent></Select>
                        )} />
                         <FormField control={form.control} name="preferences.size" render={({ field }) => (
                             <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Qualquer">Tamanho</SelectItem><SelectItem value="Pequeno">Pequeno</SelectItem><SelectItem value="Médio">Médio</SelectItem><SelectItem value="Grande">Grande</SelectItem></SelectContent></Select>
                        )} />
                         <FormField control={form.control} name="preferences.age" render={({ field }) => (
                             <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Qualquer">Idade</SelectItem><SelectItem value="Filhote">Filhote</SelectItem><SelectItem value="Adulto">Adulto</SelectItem><SelectItem value="Idoso">Idoso</SelectItem></SelectContent></Select>
                        )} />
                    </div>
                  </div>
                   <FormField
                    control={form.control}
                    name="temperament"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Que tipo de temperamento você busca?</FormLabel>
                        <FormControl><Textarea placeholder="Ex: Um companheiro calmo para o sofá, um parceiro de aventuras, um animal independente..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full text-lg" size="lg">
                    {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Buscando...</> : <><Heart className="mr-2 h-5 w-5" /> Encontrar meu match</>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold font-headline mb-4">Seus Matches Recomendados</h2>
            <Separator className="mb-6"/>
            {isLoading && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <Card key={i} className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-4 space-y-4 animate-pulse">
                                <div className="bg-muted h-40 rounded-md"></div>
                                <div className="space-y-2">
                                    <div className="h-6 w-1/2 bg-muted rounded"></div>
                                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                                    <div className="h-4 w-full bg-muted rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            )}
            {!isLoading && matches.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in-50">
                    {matches.map(animal => (
                        <AnimalCard key={animal.id} animal={animal} />
                    ))}
                </div>
            )}
            {!isLoading && !error && matches.length === 0 && (
                 <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/70 backdrop-blur-sm shadow-lg min-h-[30rem] transition-all duration-300">
                    <PawPrint className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Preencha o formulário ao lado</h3>
                    <p className="text-muted-foreground mt-2">
                        Seus matches perfeitos aparecerão aqui!
                    </p>
                </Card>
            )}
             {!isLoading && error && (
                 <Card className="flex flex-col items-center justify-center p-12 text-center bg-destructive/10 text-destructive-foreground backdrop-blur-sm shadow-lg min-h-[30rem] transition-all duration-300">
                    <PawPrint className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-semibold">Ocorreu um erro</h3>
                    <p className="mt-2">
                        {error}
                    </p>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
