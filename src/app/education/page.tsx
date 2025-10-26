'use client';

import {
  BookOpen,
  ShieldCheck,
  Home,
  Heart,
  Users,
  CalendarDays,
  AlertTriangle,
  Megaphone,
  Globe,
  ClipboardCheck,
  Lightbulb,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PillarCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="text-center bg-card/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <CardHeader>
      <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit">{icon}</div>
      <CardTitle className="font-headline pt-4 text-xl md:text-2xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const stats = [
  {
    value: '6 milhões+',
    label: 'Cães e gatos abandonados no Brasil',
    detail: 'Estimativa da OMS e ONGs parceiras',
  },
  {
    value: '40%',
    label: 'Dos abandonos ocorrem ainda filhotes',
    detail: 'Fonte: Fórum Nacional de Proteção',
  },
  {
    value: 'R$ 250/mês',
    label: 'Custo médio para manter um pet saudável',
    detail: 'Inclui alimentação, prevenção e consultas',
  },
];

const actionSteps = [
  {
    title: 'Antes de adotar',
    description: 'Converse com a família, entenda rotina, cheque restrições em condomínio e reserve orçamento mensal.',
    tip: 'Use nossa checklist gratuita para mapear necessidades do pet.',
    icon: <ClipboardCheck className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Durante a adaptação',
    description: 'Prepare um cantinho seguro, mantenha uma rotina estável e marque consulta veterinária nas primeiras semanas.',
    tip: 'Registre o pet e atualize o microchip/carteirinha de vacinação.',
    icon: <Home className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Conscientize sua rede',
    description: 'Compartilhe histórias de adoção, apoie mutirões de castração e denuncie maus-tratos no canal correto.',
    tip: 'Siga ONGs locais e amplifique campanhas nas redes.',
    icon: <Megaphone className="h-6 w-6 text-primary" />,
  },
];

const resources = [
  {
    title: 'Guia de posse responsável',
    description: 'Checklist com vacinação, castração, alimentação e bem-estar social para o primeiro ano.',
    link: '/docs/guia-posse-responsavel.pdf',
    cta: 'Baixar guia',
  },
  {
    title: 'Mapa de campanhas de castração',
    description: 'Calendário colaborativo com mutirões gratuitos ou a baixo custo na sua região.',
    link: '/shelters',
    cta: 'Ver mapa',
  },
  {
    title: 'Canal de denúncias',
    description: 'Passo a passo para registrar ocorrências e salvar evidências de forma segura.',
    link: '/docs/denuncie.pdf',
    cta: 'Como denunciar',
  },
];

const myths = [
  {
    myth: '“Pets adultos não se adaptam.”',
    truth: 'Adultos podem ser mais calmos e já educados. O que determina a adaptação é o vínculo e a rotina segura.',
  },
  {
    myth: '“Castração deixa o animal triste.”',
    truth: 'Procedimento reduz tumores, fugas e gestações indesejadas — é recomendado pelos conselhos veterinários.',
  },
  {
    myth: '“Se eu doar, não é abandono.”',
    truth: 'O tutor continua responsável até garantir novo lar verificável, com termo de adoção e acompanhamento.',
  },
];

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
              Adotar um animal é um ato de amor que traz uma alegria imensa, mas também uma grande responsabilidade. Um animal de estimação é um
              membro da família que dependerá de você por toda a vida. Antes de tomar essa decisão, é crucial entender as consequências do abandono
              e os pilares de uma posse responsável.
            </p>
          </Card>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">Por que conscientizar?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-primary/5 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-4xl font-headline text-primary">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg">{stat.label}</p>
                  <p className="text-muted-foreground text-sm mt-1">{stat.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4 flex justify-center items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Dados aproximados atualizados em 2024 — quanto mais pessoas informadas, menores esses números.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">As Duras Consequências do Abandono</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-card/50 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="font-semibold text-xl font-headline flex items-center">
                <ShieldCheck className="mr-3 text-primary" />Riscos e Perigos
              </h3>
              <p className="mt-2 text-muted-foreground">
                Animais domésticos não estão preparados para a vida na rua. Ficam expostos à fome, sede, doenças, atropelamentos, maus-tratos e
                ataques de outros animais.
              </p>
            </div>
            <div className="p-6 bg-card/50 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="font-semibold text-xl font-headline flex items-center">
                <Heart className="mr-3 text-primary" />Impacto Emocional
              </h3>
              <p className="mt-2 text-muted-foreground">
                Cães e gatos criam laços profundos com suas famílias. O abandono gera medo, ansiedade, depressão e uma profunda tristeza, quebrando a
                confiança que tinham nos humanos.
              </p>
            </div>
            <div className="p-6 bg-card/50 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="font-semibold text-xl font-headline flex items-center">
                <Users className="mr-3 text-primary" />Superlotação de Abrigos
              </h3>
              <p className="mt-2 text-muted-foreground">
                O abandono constante superlota os abrigos, que lutam com recursos limitados. Isso dificulta o resgate de outros animais em risco e
                diminui a qualidade de vida dos que já estão lá.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">Pilares da Posse Responsável</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PillarCard
              icon={<Home className="h-8 w-8 md:h-10 md:w-10" />}
              title="Ambiente Seguro"
              description="Prover um lar protegido do clima, perigos e estresse, com espaço adequado para o animal."
            />
            <PillarCard
              icon={<ShieldCheck className="h-8 w-8 md:h-10 md:w-10" />}
              title="Saúde e Cuidados"
              description="Garantir vacinação em dia, alimentação de qualidade, higiene e visitas regulares ao veterinário."
            />
            <PillarCard
              icon={<CalendarDays className="h-8 w-8 md:h-10 md:w-10" />}
              title="Compromisso a Longo Prazo"
              description="Entender que um animal é um companheiro por muitos anos, incluindo planejamento para o futuro."
            />
          </div>
        </section>

        <section className="mt-20">
          <div className="flex flex-col lg:flex-row gap-8">
            <Card className="flex-1 bg-card/70 backdrop-blur-sm border-0 shadow-lg p-6">
              <CardHeader className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <Globe className="h-5 w-5" />
                  <p className="uppercase text-xs tracking-[0.2em]">Plano de ação</p>
                </div>
                <CardTitle className="text-3xl font-headline">Transforme consciência em atitude</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {actionSteps.map((step) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="mt-1">{step.icon}</div>
                    <div>
                      <p className="font-semibold text-lg">{step.title}</p>
                      <p className="text-muted-foreground">{step.description}</p>
                      <p className="text-sm text-primary mt-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        {step.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="flex-1 bg-gradient-to-br from-primary/20 via-primary/5 to-background border-0 shadow-xl p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-3">
                  <BookOpen className="text-primary" /> Histórias que inspiram
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-lg leading-relaxed text-foreground/90">
                <p>
                  “Depois de adotar a Amora, percebi quantas pessoas ainda desconhecem o abandono. Passei a visitar escolas e o número de adoções na
                  minha cidade dobrou em 1 ano.”
                </p>
                <p className="text-sm text-muted-foreground">— Bruna Silva, voluntária e tutora</p>
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" /> Compartilhe sua história
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Poste nas redes com a hashtag <span className="text-primary font-semibold">#AdoteComAmor</span> e marque ONGs locais para amplificar a
                    mensagem.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">Mitos x Realidade</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {myths.map((item) => (
              <Card key={item.myth} className="border-0 shadow-lg bg-card/70">
                <CardContent className="pt-6 space-y-4">
                  <p className="flex items-center gap-2 text-destructive font-semibold">
                    <XCircle className="h-5 w-5" /> {item.myth}
                  </p>
                  <p className="flex items-center gap-2 text-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" /> {item.truth}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">Materiais para compartilhar</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.title} className="border border-primary/20 shadow-sm hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{resource.description}</p>
                  <a href={resource.link} className="inline-flex items-center text-primary font-semibold hover:underline">
                    {resource.cta}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-8 bg-primary text-primary-foreground border-0">
            <CardContent className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Precisa de apoio para uma palestra ou oficina?</p>
                <p className="text-primary-foreground/80">Nosso time envia kits de conscientização digitais em até 48h.</p>
              </div>
              <a href="/contact" className="bg-white text-primary px-6 py-3 rounded-md font-semibold shadow">
                Solicitar kit
              </a>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
