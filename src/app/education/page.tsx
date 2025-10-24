'use client';

import { useState } from 'react';
import Image from 'next/image';
import { generateAbandonmentConsequences } from '@/ai/flows/generate-abandonment-consequences';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader, AlertTriangle, BookOpen, ShieldCheck, Home } from 'lucide-react';

export default function EducationPage() {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const heroImage = PlaceHolderImages.find((img) => img.id === 'education-hero');

  const handleGenerateExplanation = async () => {
    if (!topic) {
      setError('Por favor, insira um tópico.');
      return;
    }
    setIsLoading(true);
    setError('');
    setExplanation('');
    try {
      const result = await generateAbandonmentConsequences({ topic });
      setExplanation(result.explanation);
    } catch (e) {
      setError('Ocorreu um erro ao gerar a explicação. Tente novamente.');
      console.error(e);
    }
    setIsLoading(false);
  };

  const sampleTopics = [
    'O que acontece com animais idosos em abrigos?',
    'Por que o abandono aumenta no período de férias?',
    'Quais os riscos para um animal doméstico abandonado na rua?',
  ];

  return (
    <div>
      <section className="relative w-full py-20 md:py-32 bg-primary/10">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Educação que Salva Vidas</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Entender a posse responsável é o primeiro passo para combater o abandono. Aprenda, conscientize-se e faça parte da mudança.
          </p>
        </div>
      </section>
      
      <div className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-headline">
                    <Lightbulb className="w-6 h-6 mr-3 text-primary" />
                    Pergunte à IA
                  </CardTitle>
                  <CardDescription>
                    Tem alguma dúvida sobre as consequências do abandono? Peça uma explicação simples com analogias.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Ex: O impacto emocional do abandono em um cão"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerateExplanation()}
                      disabled={isLoading}
                    />
                     <div className="text-xs text-muted-foreground">
                        Ou tente um destes:
                        <div className="flex flex-wrap gap-2 mt-2">
                            {sampleTopics.map(t => (
                                <button key={t} onClick={() => setTopic(t)} className="text-primary hover:underline text-left">"{t}"</button>
                            ))}
                        </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleGenerateExplanation} disabled={isLoading} className="w-full">
                    {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Gerando...' : 'Explicar Tópico'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="min-h-[20rem] flex items-center justify-center">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {explanation && (
                <Card className="bg-accent/20 border-accent shadow-md animate-in fade-in-50">
                   <CardHeader>
                       <CardTitle className="font-headline text-xl">{topic}</CardTitle>
                   </CardHeader>
                   <CardContent>
                       <p className="whitespace-pre-wrap">{explanation}</p>
                   </CardContent>
                </Card>
              )}
               {!isLoading && !explanation && !error && (
                <div className="text-center text-muted-foreground">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4"/>
                    <p>A explicação gerada pela IA aparecerá aqui.</p>
                </div>
               )}
            </div>
        </div>

        <section className="mt-24">
            <h2 className="text-3xl font-bold font-headline text-center mb-12">Pilares da Posse Responsável</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                    <Home className="h-12 w-12 mx-auto mb-4 text-primary"/>
                    <h3 className="text-xl font-semibold font-headline">Ambiente Seguro</h3>
                    <p className="mt-2 text-muted-foreground">Prover um lar protegido do clima, perigos e estresse.</p>
                </div>
                 <div className="text-center p-6">
                    <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-primary"/>
                    <h3 className="text-xl font-semibold font-headline">Cuidados e Saúde</h3>
                    <p className="mt-2 text-muted-foreground">Garantir vacinação, alimentação adequada e visitas ao veterinário.</p>
                </div>
                 <div className="text-center p-6">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary"/>
                    <h3 className="text-xl font-semibold font-headline">Compromisso a Longo Prazo</h3>
                    <p className="mt-2 text-muted-foreground">Entender que um animal é um membro da família por toda a sua vida.</p>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}
