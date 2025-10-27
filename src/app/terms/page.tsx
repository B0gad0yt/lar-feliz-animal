import { Card } from '@/components/ui/card';
import { FileText, AlertCircle, Scale, UserX, Shield } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <header className="text-center mb-12">
        <FileText className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Termos de Uso
        </h1>
        <p className="text-muted-foreground mt-2">
          Última atualização: Outubro de 2025
        </p>
      </header>

      <div className="prose prose-lg max-w-none space-y-8">
        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-2xl font-headline font-bold mb-3">1. Aceitação dos Termos</h2>
          <p className="text-foreground/80">
            Ao acessar e usar o Lar Feliz Animal, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não use nossa plataforma.
          </p>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">2. Descrição do Serviço</h2>
              <p className="text-foreground/80 mb-3">
                O Lar Feliz Animal é uma plataforma que conecta pessoas interessadas em adotar animais com abrigos e organizações de resgate. Oferecemos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li>Perfis detalhados de animais disponíveis para adoção</li>
                <li>Ferramentas de busca e filtro para encontrar pets compatíveis</li>
                <li>Formulários de candidatura à adoção</li>
                <li>Conteúdo educativo sobre posse responsável</li>
                <li>Diretório de abrigos e organizações parceiras</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <UserX className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">3. Cadastro e Conta de Usuário</h2>
              <p className="text-foreground/80 mb-3">
                Para usar determinadas funcionalidades, você deve criar uma conta:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li>Você deve ter pelo menos 18 anos para criar uma conta</li>
                <li>As informações fornecidas devem ser verdadeiras e atualizadas</li>
                <li>Você é responsável por manter a confidencialidade de sua senha</li>
                <li>Você é responsável por todas as atividades realizadas em sua conta</li>
                <li>Notifique-nos imediatamente sobre qualquer uso não autorizado</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <Scale className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">4. Processo de Adoção</h2>
              <p className="text-foreground/80 mb-3">
                <strong>Importante:</strong> O Lar Feliz Animal é uma plataforma intermediária. A decisão final sobre adoções é dos abrigos e organizações parceiras.
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li>Preencher um formulário não garante a adoção</li>
                <li>Cada abrigo tem seus próprios critérios e processos</li>
                <li>Você deve fornecer informações verdadeiras nos formulários</li>
                <li>Informações falsas podem resultar na suspensão de sua conta</li>
                <li>O abrigo pode solicitar visitas, entrevistas e documentação</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-2xl font-headline font-bold mb-3">5. Conduta do Usuário</h2>
          <p className="text-foreground/80 mb-3">Você concorda em NÃO:</p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80">
            <li>Usar a plataforma para fins ilegais ou não autorizados</li>
            <li>Fornecer informações falsas ou enganosas</li>
            <li>Assediar, ameaçar ou prejudicar outros usuários ou abrigos</li>
            <li>Tentar acessar áreas restritas da plataforma</li>
            <li>Usar bots, scrapers ou ferramentas automatizadas sem autorização</li>
            <li>Reproduzir, duplicar ou copiar o conteúdo sem permissão</li>
            <li>Violar direitos de propriedade intelectual</li>
          </ul>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">6. Isenção de Responsabilidade</h2>
              <p className="text-foreground/80 mb-3">
                <strong>O Lar Feliz Animal NÃO se responsabiliza por:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li>Decisões de adoção tomadas pelos abrigos parceiros</li>
                <li>Condições de saúde ou comportamento dos animais após a adoção</li>
                <li>Disputas entre adotantes e abrigos</li>
                <li>Informações imprecisas fornecidas por terceiros</li>
                <li>Danos indiretos, incidentais ou consequenciais</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-2xl font-headline font-bold mb-3">7. Propriedade Intelectual</h2>
          <p className="text-foreground/80">
            Todo o conteúdo da plataforma (textos, imagens, logotipos, design) é propriedade do Lar Feliz Animal ou de seus licenciadores e está protegido por leis de direitos autorais. Você não pode usar, copiar ou distribuir esse conteúdo sem autorização prévia por escrito.
          </p>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-2xl font-headline font-bold mb-3">8. Modificações dos Termos</h2>
          <p className="text-foreground/80">
            Reservamos o direito de modificar estes Termos de Uso a qualquer momento. Notificaremos os usuários sobre alterações significativas por e-mail ou através de um aviso na plataforma. O uso continuado do serviço após mudanças constitui aceitação dos novos termos.
          </p>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-2xl font-headline font-bold mb-3">9. Rescisão</h2>
          <p className="text-foreground/80">
            Podemos suspender ou encerrar sua conta a qualquer momento, sem aviso prévio, se violar estes Termos de Uso. Você também pode encerrar sua conta a qualquer momento através das configurações de perfil ou entrando em contato conosco.
          </p>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-2xl font-headline font-bold mb-3">10. Lei Aplicável e Jurisdição</h2>
          <p className="text-foreground/80">
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais competentes da comarca de São Paulo, SP.
          </p>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-2xl font-headline font-bold mb-3">11. Contato</h2>
          <p className="text-foreground/80">
            Para questões sobre estes Termos de Uso:<br />
            <strong>E-mail:</strong> legal@larfelizanimal.com<br />
            <strong>Telefone:</strong> (11) 1234-5678
          </p>
        </Card>

        <div className="text-center pt-8">
          <p className="text-muted-foreground">
            Leia também nossa{' '}
            <Link href="/privacy" className="text-primary hover:underline font-semibold">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
