'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { collection, doc, addDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Heart, LogIn } from 'lucide-react';
import Link from 'next/link';
import type { Animal } from '@/lib/types';
import 'altcha';
import 'altcha/altcha.css';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'altcha-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        challengeurl?: string;
        verifyurl?: string;
        auto?: string;
        floating?: string;
        theme?: string;
      };
    }
  }
}

const applicationSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório.'),
  email: z.string().email('Email inválido.'),
  phone: z.string().min(10, 'Telefone inválido.'),
  address: z.string().min(5, 'Endereço é obrigatório.'),
  residenceType: z.enum(['Casa', 'Apartamento'], { required_error: 'Selecione o tipo de residência.' }),
  hasOtherPets: z.string().min(1, 'Informe se possui outros animais.'),
  reason: z.string().min(20, 'Conte-nos um pouco mais sobre porque quer adotar.'),
  agreement: z.boolean().refine((val) => val === true, {
    message: 'Você deve concordar com os termos.',
  }),
});

export default function AdoptionApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [widgetElement, setWidgetElement] = useState<HTMLElement | null>(null);
  const altchaRef = useCallback((element: HTMLElement | null) => {
    setWidgetElement(element);
  }, []);

  const animalRef = useMemo(() => (firestore ? doc(firestore, 'animals', params.id) : null), [firestore, params.id]);
  const { data: animal, loading: animalLoading } = useDoc<Animal>(animalRef);

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      hasOtherPets: '',
      reason: '',
      agreement: false,
    },
  });

  useEffect(() => {
    if (!widgetElement) return;

    const handleVerified = (event: Event) => {
      const detail = (event as CustomEvent<{ payload?: string }>).detail;
      setAltchaPayload(detail?.payload ?? null);
    };

    const resetToken = () => {
      setAltchaPayload(null);
    };

    widgetElement.addEventListener('verified', handleVerified as EventListener);
    widgetElement.addEventListener('error', resetToken as EventListener);
    widgetElement.addEventListener('expired', resetToken as EventListener);
    widgetElement.addEventListener('reset', resetToken as EventListener);

    return () => {
      widgetElement.removeEventListener('verified', handleVerified as EventListener);
      widgetElement.removeEventListener('error', resetToken as EventListener);
      widgetElement.removeEventListener('expired', resetToken as EventListener);
      widgetElement.removeEventListener('reset', resetToken as EventListener);
    };
  }, [widgetElement]);

  // Dev-only fallback: allow bypassing ALTCHA during local development or when
  // NEXT_PUBLIC_ALTCHA_BYPASS=true. This helps testing the form without a
  // configured HMAC key. In production this won't run.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bypass = process.env.NEXT_PUBLIC_ALTCHA_BYPASS === 'true' || process.env.NODE_ENV === 'development';
    if (bypass) {
      setAltchaPayload((p) => p ?? 'dev-bypass-token');
    }
  }, []);

  if (animalLoading) {
    return <div className="container mx-auto text-center py-12">Carregando...</div>;
  }

  if (!animal) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4 text-center">
        <h1 className="text-2xl font-bold">Animal não encontrado</h1>
        <p className="mt-4">O animal que você está tentando adotar não existe.</p>
        <Button asChild className="mt-4">
          <Link href="/adopt">Ver outros animais</Link>
        </Button>
      </div>
    );
  }

  if (userLoading) {
    return <div className="container mx-auto text-center py-12">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Acesso Necessário</CardTitle>
            <CardDescription>Você precisa estar logado para adotar um animal.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Por favor, faça o login ou crie uma conta para continuar com o processo de adoção.</p>
            <Button asChild className="mt-6">
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" /> Fazer Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof applicationSchema>) {
    if (!firestore || !user || !animal) return;

    if (!altchaPayload) {
      toast({
        variant: 'destructive',
        title: 'Verificação pendente',
        description: 'Resolva o desafio ALTCHA antes de enviar.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationsRef = collection(firestore, 'adoptionApplications');

      await addDoc(applicationsRef, {
        animalId: animal.id,
        animalName: animal.name,
        animalPhoto: animal.photos?.[0] ?? null,
        shelterId: animal.shelterId,
        shelterAdminId: animal.createdBy ?? '',
        applicantId: user.uid,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        residenceType: values.residenceType,
        hasOtherPets: values.hasOtherPets,
        reason: values.reason,
        agreement: values.agreement,
        altchaPayload,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Formulário enviado com sucesso!',
        description: `O abrigo entrará em contato em breve sobre a adoção de ${animal?.name}.`,
      });
      router.push(`/adopt/${animal?.id}`);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar formulário',
        description: error?.message || 'Tente novamente em alguns instantes.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-headline">Formulário de Adoção</CardTitle>
          <CardDescription className="text-lg">
            Você está a um passo de mudar a vida de <span className="font-bold text-primary">{animal.name}</span>!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <h3 className="text-xl font-headline font-semibold">Suas Informações</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua rua, número e bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-xl font-headline font-semibold pt-4">Sobre seu Lar</h3>
              <FormField
                control={form.control}
                name="residenceType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de residência</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Casa" />
                          </FormControl>
                          <FormLabel className="font-normal">Casa</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Apartamento" />
                          </FormControl>
                          <FormLabel className="font-normal">Apartamento</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasOtherPets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Possui outros animais?</FormLabel>
                    <FormControl>
                      <Input placeholder="Sim, um cachorro. / Não." {...field} />
                    </FormControl>
                    <FormDescription>Se sim, quais?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Por que você gostaria de adotar {animal.name}?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Conte-nos sobre sua motivação, seu estilo de vida e como será a rotina do animal." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Termo de Compromisso</FormLabel>
                      <FormDescription>
                        Entendo que a adoção é um ato de responsabilidade e me comprometo a fornecer um ambiente seguro, amoroso e com todos os cuidados necessários para o bem-estar do animal.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Verificação Humana</FormLabel>
                <FormDescription>Resolva o desafio abaixo para confirmar que você não é um robô.</FormDescription>
                <div className="mt-2 rounded-md border border-border/60 bg-background/60 p-3">
                  <altcha-widget
                    ref={altchaRef}
                    challengeurl="/api/altcha/challenge"
                    verifyurl="/api/altcha/verify"
                    auto="off"
                    floating="auto"
                    theme="auto"
                  />
                </div>
                {!altchaPayload && (
                  <p className="mt-2 text-sm text-muted-foreground">Clique no desafio acima e aguarde a confirmação antes de enviar.</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !altchaPayload}>
                <Heart className="mr-2 h-5 w-5" /> {isSubmitting ? 'Enviando...' : 'Enviar Pedido de Adoção'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
