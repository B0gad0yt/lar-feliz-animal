import { Badge } from '@/components/ui/badge';
import { Clock, MailCheck, ShieldCheck } from 'lucide-react';

const FEATURE_LIST = [
  {
    icon: ShieldCheck,
    title: 'Segurança reforçada',
    description: 'Login com hCaptcha e monitoramento constante contra acessos suspeitos.',
  },
  {
    icon: MailCheck,
    title: 'Fluxo verificado',
    description: 'Envio automático das confirmações de email usando o SMTP do Firebase.',
  },
  {
    icon: Clock,
    title: 'Retomada rápida',
    description: 'Reset de senha instantâneo para evitar qualquer perda de acesso.',
  },
];

const HIGHLIGHT_STATS = [
  {
    label: 'Adoções em andamento',
    value: '128',
    helper: '+18% este mês',
  },
  {
    label: 'Solicitações respondidas',
    value: '92%',
    helper: 'em menos de 24h',
  },
];

export function AuthMarketingPanel() {
  return (
    <section className="relative hidden flex-col justify-between gap-10 bg-gradient-to-br from-primary via-primary/90 to-primary-foreground/40 p-8 text-white lg:flex">
      <div>
        <Badge variant="secondary" className="bg-white/20 text-white">
          Portal seguro
        </Badge>
        <h2 className="mt-4 text-3xl font-headline font-semibold leading-tight">
          Operações com governança e transparência
        </h2>
        <p className="mt-3 max-w-lg text-sm text-white/80">
          Centralize solicitações de adoção, valide identidades e mantenha o time sincronizado com alertas em tempo real.
        </p>
        <ul className="mt-8 space-y-4">
          {FEATURE_LIST.map((feature) => (
            <li key={feature.title} className="flex gap-4">
              <div className="rounded-full bg-white/15 p-2">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-medium">{feature.title}</p>
                <p className="text-sm text-white/70">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {HIGHLIGHT_STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-inner">
            <p className="text-xs uppercase tracking-wide text-white/70">{stat.label}</p>
            <p className="mt-2 text-3xl font-headline font-semibold">{stat.value}</p>
            <p className="text-sm text-white/80">{stat.helper}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
