'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Quote, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const successStories = [
  {
    id: 1,
    petName: 'Luna',
    petSpecies: 'Gata',
    adopter: 'Maria Silva',
    date: 'Junho 2025',
    image: '/images/success-luna.jpg',
    story: 'Luna estava no abrigo há mais de um ano. Era tímida e tinha medo de pessoas. Com paciência e amor, hoje ela é a rainha da casa! Dorme na minha cama todas as noites e me recebe ronronando quando chego em casa.',
    testimonial: 'Adotar a Luna foi a melhor decisão da minha vida. Ela trouxe tanta alegria e amor para o meu lar. Recomendo a todos que estão pensando em adotar: dê uma chance aos tímidos, eles são incríveis!',
    tags: ['Gato', 'Tímido', 'Transformação'],
  },
  {
    id: 2,
    petName: 'Thor',
    petSpecies: 'Cachorro',
    adopter: 'João Santos',
    date: 'Setembro 2025',
    image: '/images/success-thor.jpg',
    story: 'Thor foi resgatado das ruas com uma pata machucada. Após tratamento, ele se recuperou completamente. Agora ele adora correr no parque e é o melhor companheiro de corrida que eu poderia ter!',
    testimonial: 'Thor mudou minha rotina para melhor. Comecei a me exercitar mais, conheci novos amigos no parque e tenho um guardião fiel. Ele é pura energia e amor!',
    tags: ['Cachorro', 'Resgate', 'Ativo'],
  },
  {
    id: 3,
    petName: 'Mel e Canela',
    petSpecies: 'Gatas',
    adopter: 'Família Oliveira',
    date: 'Agosto 2025',
    image: '/images/success-mel-canela.jpg',
    story: 'Estas duas irmãs foram encontradas juntas na rua quando eram filhotes. O abrigo pediu que fossem adotadas juntas. Decidimos dar uma chance e não nos arrependemos! Elas são inseparáveis e trazem diversão diária para nossa família.',
    testimonial: 'Nossos filhos aprenderam sobre responsabilidade e compaixão cuidando da Mel e Canela. É lindo ver a conexão entre as gatinhas e as crianças. Uma adoção que transformou toda a família!',
    tags: ['Gatos', 'Dupla', 'Família'],
  },
  {
    id: 4,
    petName: 'Bob',
    petSpecies: 'Cachorro',
    adopter: 'Carlos Mendes',
    date: 'Julho 2025',
    image: '/images/success-bob.jpg',
    story: 'Bob é um cachorro idoso que passou anos em um abrigo. Muitos procuravam filhotes, mas eu queria dar uma chance a um animal mais velho. Ele é calmo, educado e se adaptou perfeitamente ao meu apartamento.',
    testimonial: 'Adotar um pet idoso foi a decisão mais gratificante. Bob não precisou de treinamento, já sabia fazer as necessidades no lugar certo e é super tranquilo. Ele ganhou uma segunda chance de ter um lar, e eu ganhei o melhor amigo.',
    tags: ['Cachorro', 'Idoso', 'Apartamento'],
  },
  {
    id: 5,
    petName: 'Nina',
    petSpecies: 'Gata',
    adopter: 'Ana Costa',
    date: 'Maio 2025',
    image: '/images/success-nina.jpg',
    story: 'Nina tinha uma condição crônica que exigia medicação diária. Muitos desistiam por isso, mas eu estava preparada para cuidar dela. Hoje ela está saudável, controlada e é a gata mais carinhosa que conheço.',
    testimonial: 'Cuidar da Nina me ensinou paciência e dedicação. Ver ela melhorar a cada dia foi recompensador. Animais com necessidades especiais merecem amor e cuidado também!',
    tags: ['Gata', 'Necessidades Especiais', 'Cuidados'],
  },
  {
    id: 6,
    petName: 'Rex',
    petSpecies: 'Cachorro',
    adopter: 'Pedro Almeida',
    date: 'Outubro 2025',
    image: '/images/success-rex.jpg',
    story: 'Rex tinha fama de "difícil" no abrigo por ser muito enérgico. Na verdade, ele só precisava de espaço e atividades! Hoje fazemos trilhas juntos nos fins de semana e ele é o companheiro de aventuras perfeito.',
    testimonial: 'O que alguns viam como problema, eu vi como compatibilidade. Rex precisava de alguém ativo como eu. Agora somos parceiros inseparáveis em todas as aventuras ao ar livre!',
    tags: ['Cachorro', 'Enérgico', 'Aventuras'],
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline flex items-center justify-center gap-3">
          <Heart className="h-10 w-10 text-primary fill-primary" />
          Histórias de Sucesso
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Conheça histórias inspiradoras de adoções que mudaram vidas - tanto dos pets quanto dos tutores!
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {successStories.map((story) => (
          <Card key={story.id} className="overflow-hidden bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="relative h-64 w-full">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Heart className="h-24 w-24 text-primary/40" />
              </div>
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {story.date}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-headline font-bold">{story.petName}</h3>
                <p className="text-muted-foreground">Adotado por {story.adopter}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {story.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">A História:</h4>
                  <p className="text-sm text-foreground/80">{story.story}</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                  <Quote className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm italic text-foreground/80">"{story.testimonial}"</p>
                  <p className="text-xs text-muted-foreground mt-2">— {story.adopter}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-0 shadow-xl">
        <Heart className="h-16 w-16 mx-auto text-primary fill-primary mb-4" />
        <h2 className="text-3xl font-headline font-bold mb-4">
          Sua história pode ser a próxima!
        </h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Milhares de animais estão esperando por um lar cheio de amor. Comece sua jornada de adoção hoje e transforme uma vida (ou duas)!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-bold">
            <Link href="/adopt">
              <Heart className="mr-2 h-5 w-5" />
              Ver Animais Disponíveis
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-bold">
            <Link href="/matcher">
              Encontrar Meu Match
            </Link>
          </Button>
        </div>
      </Card>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Você adotou um pet através do Lar Feliz Animal? Compartilhe sua história conosco!
          <br />
          <a href="mailto:historias@larfelizanimal.com" className="text-primary hover:underline font-semibold">
            historias@larfelizanimal.com
          </a>
        </p>
      </div>
    </div>
  );
}
