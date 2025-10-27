import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    category: 'Processo de Adoção',
    questions: [
      {
        q: 'Como funciona o processo de adoção?',
        a: 'Primeiro, navegue pelos perfis dos animais disponíveis e encontre aquele que mais combina com você. Depois, preencha o formulário de adoção online. Nossa equipe analisará seu pedido e entrará em contato para uma entrevista. Se aprovado, agendaremos uma visita para você conhecer o animal pessoalmente.',
      },
      {
        q: 'Quanto tempo demora o processo de adoção?',
        a: 'Geralmente, o processo leva de 5 a 10 dias úteis, dependendo da disponibilidade para entrevistas e visitas. Queremos garantir que cada adoção seja bem-sucedida e segura para o animal.',
      },
      {
        q: 'Há alguma taxa de adoção?',
        a: 'Alguns abrigos cobram uma taxa de adoção simbólica (geralmente entre R$ 50 e R$ 200) para ajudar a cobrir os custos de vacinação, castração e cuidados veterinários. Isso varia de acordo com cada abrigo.',
      },
      {
        q: 'Posso adotar se moro em apartamento?',
        a: 'Sim! Muitos animais se adaptam perfeitamente à vida em apartamento. Durante o processo de adoção, ajudamos você a encontrar o pet ideal para seu estilo de vida e espaço disponível.',
      },
    ],
  },
  {
    category: 'Cuidados com o Pet',
    questions: [
      {
        q: 'Quais são os custos mensais de manter um pet?',
        a: 'Em média, o custo mensal varia entre R$ 200 e R$ 500, incluindo ração de qualidade, petiscos, itens de higiene, e uma reserva para eventuais consultas veterinárias. Pets de porte maior podem ter custos mais elevados.',
      },
      {
        q: 'O animal já vem vacinado e castrado?',
        a: 'Na maioria dos casos, sim. Os animais disponíveis para adoção geralmente já estão vacinados, vermifugados e castrados. Essa informação está disponível no perfil de cada animal.',
      },
      {
        q: 'Como preparar minha casa para receber o pet?',
        a: 'Remova objetos perigosos, prepare um espaço confortável com cama e água, compre ração adequada, e deixe brinquedos disponíveis. Para gatos, não esqueça da caixa de areia. Recomendamos também fazer uma revisão veterinária nas primeiras semanas.',
      },
      {
        q: 'Posso devolver o animal se não me adaptar?',
        a: 'Entendemos que às vezes a adaptação pode ser difícil. Entre em contato conosco imediatamente se houver problemas. Preferimos trabalhar com você para resolver questões de comportamento antes de considerar a devolução, mas o bem-estar do animal é sempre nossa prioridade.',
      },
    ],
  },
  {
    category: 'Sobre os Animais',
    questions: [
      {
        q: 'Posso conhecer o animal antes de adotar?',
        a: 'Sim! Incentivamos visitas presenciais. Após a aprovação inicial da sua candidatura, agendaremos uma visita para você conhecer o animal e ver se há conexão entre vocês.',
      },
      {
        q: 'Como sei se um animal combina comigo?',
        a: 'Use nossa ferramenta "Encontrar Match" para filtrar animais por temperamento e características. Também fornecemos perfis detalhados com personalidade, nível de energia e necessidades específicas de cada animal.',
      },
      {
        q: 'Posso adotar mais de um animal?',
        a: 'Sim! Se você tem condições de cuidar bem de mais de um pet, será um prazer ajudá-lo. Alguns animais até preferem ter companhia e podem se adaptar melhor em duplas.',
      },
      {
        q: 'Os animais têm algum problema de saúde?',
        a: 'Todos os perfis incluem informações sobre saúde. Alguns animais podem ter necessidades especiais ou condições crônicas gerenciáveis. Sempre somos transparentes sobre o histórico de saúde.',
      },
    ],
  },
  {
    category: 'Requisitos',
    questions: [
      {
        q: 'Preciso ter experiência com pets para adotar?',
        a: 'Não necessariamente. Oferecemos orientação e suporte para novos tutores. No entanto, alguns animais com necessidades especiais podem requerer experiência prévia.',
      },
      {
        q: 'Menores de idade podem adotar?',
        a: 'Menores de 18 anos não podem adotar diretamente, mas encorajamos que toda a família participe do processo. Um adulto responsável deve ser o tutor oficial.',
      },
      {
        q: 'Preciso ter quintal para adotar um cachorro?',
        a: 'Não necessariamente. O mais importante é que você possa proporcionar exercícios regulares e passeios diários. Muitos cachorros se adaptam bem a apartamentos se receberem atividade física adequada.',
      },
    ],
  },
  {
    category: 'Pós-Adoção',
    questions: [
      {
        q: 'Há acompanhamento após a adoção?',
        a: 'Sim! Fazemos contato nas primeiras semanas para ver como está a adaptação. Também estamos sempre disponíveis para dúvidas e orientações, mesmo anos depois da adoção.',
      },
      {
        q: 'Posso receber ajuda com treinamento?',
        a: 'Oferecemos orientações básicas e podemos indicar profissionais qualificados para treinamento e comportamento animal, caso necessário.',
      },
      {
        q: 'E se eu precisar viajar?',
        a: 'Planeje com antecedência. Você pode deixar seu pet com amigos/familiares, usar serviços de hospedagem pet (hotel/creche), ou em alguns casos, levar o animal com você. Nunca abandone seu pet.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Perguntas Frequentes
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Tire suas dúvidas sobre o processo de adoção
        </p>
      </header>

      <div className="space-y-8">
        {faqs.map((category, idx) => (
          <div key={idx}>
            <h2 className="text-2xl font-headline font-bold mb-4 text-primary">
              {category.category}
            </h2>
            <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg p-4">
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, faqIdx) => (
                  <AccordionItem key={faqIdx} value={`item-${idx}-${faqIdx}`}>
                    <AccordionTrigger className="text-left font-semibold">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        ))}
      </div>

      <Card className="mt-12 p-8 text-center bg-primary/5 border-primary/20">
        <MessageCircle className="h-12 w-12 mx-auto text-primary mb-4" />
        <h3 className="text-2xl font-headline font-bold mb-2">
          Não encontrou sua resposta?
        </h3>
        <p className="text-muted-foreground mb-6">
          Entre em contato conosco e teremos prazer em ajudar!
        </p>
        <Button asChild size="lg">
          <Link href="/shelters">Falar com um Abrigo</Link>
        </Button>
      </Card>
    </div>
  );
}
