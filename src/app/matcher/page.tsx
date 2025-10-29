'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CollectionReference } from 'firebase/firestore';
import type { Animal } from '@/lib/types';
import { temperamentOptions } from '@/lib/data';
import { useUser } from '@/firebase/auth/use-user';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { AnimalCard } from '@/components/animal-card';
import { Card, CardContent } from '@/components/ui/card';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { Sparkles, PawPrint } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function MatcherPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const animalsQuery = useMemo(() => (firestore ? (collection(firestore, 'animals') as CollectionReference<Animal>) : null), [firestore]);
  const { data: animals, loading: animalsLoading } = useCollection<Animal>(animalsQuery);

  const [selectedTemperaments, setSelectedTemperaments] = useState<string[]>([]);
  // Questionário simplificado para ajudar o usuário a definir temperamentos.
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ energy?: 'quiet' | 'active'; sociability?: 'independent' | 'social'; affection?: 'reserved' | 'affectionate' }>({});

  const mapAnswersToTemperaments = () => {
    const temps: string[] = [];
    if (quizAnswers.energy === 'active') temps.push('energetico', 'brincalhao');
    if (quizAnswers.energy === 'quiet') temps.push('calmo', 'timido');
    if (quizAnswers.sociability === 'social') temps.push('sociavel', 'amigavel');
    if (quizAnswers.sociability === 'independent') temps.push('independente', 'esperto');
    if (quizAnswers.affection === 'affectionate') temps.push('carinhoso', 'amoroso', 'leal');
    if (quizAnswers.affection === 'reserved') temps.push('inteligente');
    return Array.from(new Set(temps));
  };

  const applyQuizToTemperaments = () => {
    const derived = mapAnswersToTemperaments();
    setSelectedTemperaments(derived);
    setQuizStarted(false);
  };

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

  if (userLoading) {
    return (
      <div className="container mx-auto py-24 px-4 flex items-center justify-center">
        <Card className="p-8 bg-card/70 backdrop-blur-sm shadow-lg"><p>Carregando...</p></Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-24 px-4">
        <Card className="max-w-xl mx-auto bg-card/70 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Sparkles className="h-8 w-8 text-primary" /> Encontre seu Match</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Faça login para acessar o questionário e descobrir o pet ideal para seu estilo de vida.</p>
            <div className="flex gap-4">
              <Button asChild variant="default"><Link href="/login">Login</Link></Button>
              <Button asChild variant="outline"><Link href="/register">Registrar</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline flex items-center justify-center">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 mr-4 text-primary" />
            Encontre seu Match Perfeito
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 ml-4 text-primary" />
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Responda o questionário ou marque manualmente os temperamentos desejados para ver sugestões.
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <CollapsibleSection title={<span className="font-headline text-xl">Questionário Rápido</span>} defaultCollapsed className="sticky top-24">
            {!quizStarted ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Responda 3 perguntas e geraremos uma combinação inicial de temperamentos.</p>
                <Button size="sm" onClick={() => setQuizStarted(true)}>Começar</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="font-medium">Você prefere cães mais quietinhos ou agitados?</p>
                  <div className="flex gap-3 mt-2">
                    <Button variant={quizAnswers.energy === 'quiet' ? 'default' : 'outline'} size="sm" onClick={() => setQuizAnswers(a => ({ ...a, energy: 'quiet' }))}>Quietinhos</Button>
                    <Button variant={quizAnswers.energy === 'active' ? 'default' : 'outline'} size="sm" onClick={() => setQuizAnswers(a => ({ ...a, energy: 'active' }))}>Agitados</Button>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Você busca um companheiro mais independente ou muito sociável?</p>
                  <div className="flex gap-3 mt-2">
                    <Button variant={quizAnswers.sociability === 'independent' ? 'default' : 'outline'} size="sm" onClick={() => setQuizAnswers(a => ({ ...a, sociability: 'independent' }))}>Independente</Button>
                    <Button variant={quizAnswers.sociability === 'social' ? 'default' : 'outline'} size="sm" onClick={() => setQuizAnswers(a => ({ ...a, sociability: 'social' }))}>Sociável</Button>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Quanto carinho você espera trocar diariamente?</p>
                  <div className="flex gap-3 mt-2">
                    <Button variant={quizAnswers.affection === 'reserved' ? 'default' : 'outline'} size="sm" onClick={() => setQuizAnswers(a => ({ ...a, affection: 'reserved' }))}>Moderado</Button>
                    <Button variant={quizAnswers.affection === 'affectionate' ? 'default' : 'outline'} size="sm" onClick={() => setQuizAnswers(a => ({ ...a, affection: 'affectionate' }))}>Muito carinho</Button>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <Button size="sm" onClick={applyQuizToTemperaments} disabled={!quizAnswers.energy || !quizAnswers.sociability || !quizAnswers.affection}>Gerar Temperamentos</Button>
                  <Button size="sm" variant="outline" onClick={() => { setQuizStarted(false); setQuizAnswers({}); }}>Cancelar</Button>
                </div>
              </div>
            )}
          </CollapsibleSection>
          <CollapsibleSection title={<span className="font-headline text-2xl">Temperamento Desejado</span>} defaultCollapsed className="sticky top-[24rem]">
            <div className="grid grid-cols-2 gap-4">
              {temperamentOptions.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={selectedTemperaments.includes(item.id)}
                    onCheckedChange={() => handleTemperamentChange(item.id)}
                  />
                  <Label htmlFor={item.id} className="font-normal cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
            {selectedTemperaments.length > 0 && (
              <p className="mt-4 text-xs text-muted-foreground">Baseado em suas escolhas mostramos animais que possuem TODOS os temperamentos marcados.</p>
            )}
          </CollapsibleSection>
        </div>
        <div className="lg:col-span-3">
          <CollapsibleSection
            title={<span className="font-headline text-2xl">Resultados ({matches.length})</span>}
            defaultCollapsed
            forceMount
          >
            {animalsLoading ? (
              renderSkeleton()
            ) : matches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in-50 duration-500">
                {matches.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg min-h-[20rem] transition-all duration-300 ease-in-out">
                <PawPrint className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Nenhum animal encontrado</h3>
                <p className="text-muted-foreground mt-2">Ajuste as respostas ou selecione menos temperamentos para ampliar os resultados.</p>
              </Card>
            )}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}

    
