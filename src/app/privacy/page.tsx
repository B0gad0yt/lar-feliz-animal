'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';
import type { SiteConfig } from '@/lib/types';

export default function PrivacyPage() {
  const firestore = useFirestore();
  const configRef = useMemo(() => (firestore ? (doc(firestore, 'config', 'site') as DocumentReference<SiteConfig>) : null), [firestore]);
  const { data: siteConfig } = useDoc<SiteConfig>(configRef);
  
  const siteName = siteConfig?.title || 'Lar Feliz Animal';
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <header className="text-center mb-12">
        <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Política de Privacidade
        </h1>
        <p className="text-muted-foreground mt-2">
          Última atualização: Outubro de 2025
        </p>
      </header>

      <div className="prose prose-lg max-w-none space-y-8">
        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <Eye className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">1. Informações que Coletamos</h2>
              <p className="text-foreground/80 mb-3">
                Coletamos informações que você nos fornece diretamente ao:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li>Criar uma conta no {siteName}</li>
                <li>Preencher formulários de adoção</li>
                <li>Entrar em contato conosco</li>
                <li>Interagir com nossa plataforma (favoritos, pesquisas)</li>
              </ul>
              <p className="text-foreground/80 mt-3">
                As informações podem incluir: nome, e-mail, telefone, endereço, e preferências relacionadas à adoção de animais.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <Database className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">2. Como Usamos Suas Informações</h2>
              <p className="text-foreground/80 mb-3">
                Utilizamos as informações coletadas para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li>Processar e gerenciar pedidos de adoção</li>
                <li>Comunicar sobre o status de sua candidatura</li>
                <li>Melhorar nossa plataforma e serviços</li>
                <li>Enviar atualizações importantes sobre animais e abrigos</li>
                <li>Personalizar sua experiência no site</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <UserCheck className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">3. Compartilhamento de Informações</h2>
              <p className="text-foreground/80 mb-3">
                Compartilhamos suas informações apenas:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li><strong>Com abrigos parceiros:</strong> quando você se candidata a adotar um animal</li>
                <li><strong>Com seu consentimento:</strong> em qualquer outra situação</li>
                <li><strong>Por requisição legal:</strong> quando exigido por lei</li>
              </ul>
              <p className="text-foreground/80 mt-3">
                <strong>Nunca vendemos suas informações pessoais a terceiros.</strong>
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <Lock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">4. Segurança dos Dados</h2>
              <p className="text-foreground/80">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos Firebase/Firestore com criptografia em trânsito e em repouso, autenticação segura e controles de acesso rigorosos.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">5. Seus Direitos (LGPD)</h2>
              <p className="text-foreground/80 mb-3">
                Você tem o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incorretos ou incompletos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento a qualquer momento</li>
                <li>Solicitar portabilidade dos dados</li>
                <li>Opor-se ao processamento de seus dados</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <Database className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">6. Cookies e Tecnologias Similares</h2>
              <p className="text-foreground/80">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação, analisar o uso do site e personalizar conteúdo. Você pode gerenciar preferências de cookies através das configurações do seu navegador.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-3">7. Contato</h2>
              <p className="text-foreground/80 mb-3">
                Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
              </p>
              <p className="text-foreground/80">
                <strong>E-mail:</strong> privacidade@larfelizanimal.com<br />
                <strong>Encarregado de Dados (DPO):</strong> dpo@larfelizanimal.com
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-2xl font-headline font-bold mb-3">8. Alterações nesta Política</h2>
          <p className="text-foreground/80">
            Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas por e-mail ou através de um aviso em nosso site. Recomendamos revisar esta página regularmente.
          </p>
        </Card>

        <div className="text-center pt-8">
          <p className="text-muted-foreground">
            Tem dúvidas? Consulte também nossos{' '}
            <Link href="/terms" className="text-primary hover:underline font-semibold">
              Termos de Uso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
