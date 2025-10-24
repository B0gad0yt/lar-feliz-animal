'use client';

import { BookOpen, ShieldCheck, Home, Heart, Users, CalendarDays } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PillarCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <CardHeader>
      <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit">
        {icon}
      </div>
      <CardTitle className="font-headline pt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);


export default function EducationPage() {
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
        <section>
          <h2 className="text-3xl font-bold font-headline text-center mb-6">O Compromisso da Adoção</h2>
          <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg p-6 md:p-8">
            <p className="text-lg text-foreground/80 leading-relaxed text-center">
              Adotar um animal é um ato de amor que traz uma alegria imensa, mas também uma grande responsabilidade. Um animal de estimação é um membro da família que dependerá de você por toda a vida. Antes de tomar essa decisão, é crucial entender as consequências do abandono e os pilares de uma posse responsável.
            </p>
          </Card>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">As Duras Consequências do Abandono</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-card/50 rounded-lg shadow-md backdrop-blur-sm">
                  <h3 className="font-semibold text-xl font-headline flex items-center"><ShieldCheck className="mr-3 text-primary"/>Riscos e Perigos</h3>
                  <p className="mt-2 text-muted-foreground">
                    Animais domésticos não estão preparados para a vida na rua. Ficam expostos à fome, sede, doenças, atropelamentos, maus-tratos e ataques de outros animais.
                  </p>
              </div>
              <div className="p-6 bg-card/50 rounded-lg shadow-md backdrop-blur-sm">
                  <h3 className="font-semibold text-xl font-headline flex items-center"><Heart className="mr-3 text-primary"/>Impacto Emocional</h3>
                  <p className="mt-2 text-muted-foreground">
                    Cães e gatos criam laços profundos com suas famílias. O abandono gera medo, ansiedade, depressão e uma profunda tristeza, quebrando a confiança que tinham nos humanos.
                  </p>
              </div>
               <div className="p-6 bg-card/50 rounded-lg shadow-md backdrop-blur-sm">
                  <h3 className="font-semibold text-xl font-headline flex items-center"><Users className="mr-3 text-primary"/>Superlotação de Abrigos</h3>
                  <p className="mt-2 text-muted-foreground">
                    O abandono constante superlota os abrigos, que lutam com recursos limitados. Isso dificulta o resgate de outros animais em risco e diminui a qualidade de vida dos que já estão lá.
                  </p>
              </div>
          </div>
        </section>

        <section className="mt-20">
            <h2 className="text-3xl font-bold font-headline text-center mb-12">Pilares da Posse Responsável</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PillarCard 
                  icon={<Home className="h-10 w-10"/>}
                  title="Ambiente Seguro"
                  description="Prover um lar protegido do clima, perigos e estresse, com espaço adequado para o animal."
                />
                 <PillarCard 
                  icon={<ShieldCheck className="h-10 w-10"/>}
                  title="Saúde e Cuidados"
                  description="Garantir vacinação em dia, alimentação de qualidade, higiene e visitas regulares ao veterinário."
                />
                 <PillarCard 
                  icon={<CalendarDays className="h-10 w-10"/>}
                  title="Compromisso a Longo Prazo"
                  description="Entender que um animal é um companheiro por muitos anos, incluindo planejamento para o futuro."
                />
            </div>
        </section>

      </div>
    </div>
  );
}
