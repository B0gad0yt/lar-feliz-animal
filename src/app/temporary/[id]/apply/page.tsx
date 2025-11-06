'use client';

import { useRouter } from 'next/navigation';
import { use, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { collection, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, HandHeart, LogIn, Info } from 'lucide-react';
import Link from 'next/link';
import type { TemporaryAnimal } from '@/lib/types';
import Script from 'next/script';
declare global {
  interface Window {
    hcaptcha?: any;
  }
}

const fosterApplicationSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório.'),
  email: z.string().email('Email inválido.'),
  phone: z.string().min(10, 'Telefone inválido.'),
  address: z.string().min(5, 'Endereço é obrigatório.'),
  residenceType: z.enum(['Casa', 'Apartamento'], { required_error: 'Selecione o tipo de residência.' }),
  hasOtherPets: z.string().min(1, 'Informe se possui outros animais.'),
  availability: z.string().min(10, 'Informe quanto tempo pode acolher o animal.'),
  experience: z.string().min(10, 'Conte-nos sobre sua experiência com animais.'),
  agreement: z.boolean().refine((val) => val === true, {
    message: 'Você deve concordar com os termos.',
  }),
});

export default function FosterApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);
  const initialSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ?? null;
  const [siteKey, setSiteKey] = useState<string | null>(initialSiteKey);
  const [siteKeyLoading, setSiteKeyLoading] = useState(!initialSiteKey);
  const [siteKeyError, setSiteKeyError] = useState<string | null>(null);
  const [siteKeyAttempt, setSiteKeyAttempt] = useState(0);
  const [scriptReady, setScriptReady] = useState(false);
  const hcaptchaContainer = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  const animalRef = useMemo(() => (firestore ? (doc(firestore, 'temporaryAnimals', id) as DocumentReference<TemporaryAnimal>) : null), [firestore, id]);
  const { data: animal, loading: animalLoading } = useDoc<TemporaryAnimal>(animalRef);

  const form = useForm<z.infer<typeof fosterApplicationSchema>>({
    resolver: zodResolver(fosterApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      hasOtherPets: '',
      availability: '',
      experience: '',
      agreement: false,
    },
  });
  
  const [fullNameValue, emailValue, phoneValue, addressValue, agreementValue] = form.watch(['fullName', 'email', 'phone', 'address', 'agreement']);
  const hasBasicInfo = Boolean(fullNameValue && emailValue && phoneValue && addressValue);
  const hasAgreement = Boolean(agreementValue);
  const hasCaptcha = Boolean(hcaptchaToken);

  const progressSteps = useMemo(
    () => [
      {
        label: '1. Seus dados',
        description: 'Contato e endereço',
        status: hasBasicInfo ? 'done' : 'current',
      },
      {
        label: '2. Termos',
        description: 'Assine o compromisso',
        status: hasAgreement ? 'done' : hasBasicInfo ? 'current' : 'upcoming',
      },
      {
        label: '3. Verificação',
        description: 'Confirme o hCaptcha',
        status: hasCaptcha ? 'done' : hasAgreement ? 'current' : 'upcoming',
      },
    ],
    [hasBasicInfo, hasAgreement, hasCaptcha]
  );

  // Fetch site key at runtime if needed
  useEffect(() => {
    if (siteKey || siteKeyError || !siteKeyLoading) return;
    const abortController = new AbortController();
    fetch('/api/hcaptcha/sitekey', { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.sitekey) {
          setSiteKey(data.sitekey);
        } else {
          setSiteKeyError('Site key não disponível');
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setSiteKeyError(err.message || 'Erro ao buscar site key');
        }
      })
      .finally(() => setSiteKeyLoading(false));
    return () => abortController.abort();
  }, [siteKey, siteKeyError, siteKeyLoading, siteKeyAttempt]);

  const renderHCaptcha = useCallback(() => {
    if (typeof window === 'undefined' || !window.hcaptcha || !siteKey || !hcaptchaContainer.current) return;
    if (widgetIdRef.current !== null) return;

    try {
      widgetIdRef.current = window.hcaptcha.render(hcaptchaContainer.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          setHcaptchaToken(token);
        },
        'expired-callback': () => {
          setHcaptchaToken(null);
        },
        'error-callback': () => {
          setHcaptchaToken(null);
        },
      });
    } catch (err) {
      console.error('Error rendering hCaptcha:', err);
    }
  }, [siteKey]);

  useEffect(() => {
    if (scriptReady && siteKey) {
      renderHCaptcha();
    }
  }, [scriptReady, siteKey, renderHCaptcha]);

  const handleReloadCaptcha = () => {
    if (widgetIdRef.current !== null && window.hcaptcha) {
      window.hcaptcha.reset(widgetIdRef.current);
      setHcaptchaToken(null);
    }
  };

  if (animalLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <Card className="animate-pulse">
          <CardHeader className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!animal) {
    router.push('/temporary');
    return null;
  }

  if (userLoading) {
    return <div className="container mx-auto text-center py-12">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-3xl py-8 md:py-12 px-4">
        <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-headline">Acesso Necessário</CardTitle>
            <CardDescription>Você precisa estar logado para se tornar um lar temporário.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base">Por favor, faça o login ou crie uma conta para continuar com o processo.</p>
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

  async function onSubmit(values: z.infer<typeof fosterApplicationSchema>) {
    if (!firestore || !user || !animal) return;

    if (!hcaptchaToken) {
      toast({
        variant: 'destructive',
        title: 'Verificação pendente',
        description: 'Resolva o hCaptcha antes de enviar.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationsRef = collection(firestore, 'fosterApplications');

      // Verify token server-side
      const verifyRes = await fetch('/api/hcaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: hcaptchaToken }),
      });

      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok || !verifyJson.success) {
        const details = verifyJson?.data?.['error-codes']?.join(', ');
        toast({
          variant: 'destructive',
          title: 'Verificação falhou',
          description: details ? `hCaptcha retornou: ${details}` : 'Falha ao validar hCaptcha. Tente novamente.',
        });
        handleReloadCaptcha();
        setIsSubmitting(false);
        return;
      }

      await addDoc(applicationsRef, {
        animalId: animal.id,
        animalName: animal.name,
        animalPhoto: animal.photos?.[0] ?? null,
        shelterId: animal.shelterId,
        applicantId: user.uid,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        residenceType: values.residenceType,
        hasOtherPets: values.hasOtherPets,
        availability: values.availability,
        experience: values.experience,
        agreement: values.agreement,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Formulário enviado com sucesso!',
        description: `Obrigado por se oferecer como lar temporário para ${animal?.name}. Entraremos em contato em breve!`,
      });
      router.push(`/temporary/${animal?.id}`);
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
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-8 lg:py-12">
      <Script
        src="https://js.hcaptcha.com/1/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
        onError={(error) => {
          console.error('Erro ao carregar script do hCaptcha', error);
          setSiteKeyError('O script do hCaptcha não pôde ser carregado.');
        }}
      />
      
      {/* Progress Steps - Mobile Optimized */}
      <div className="mb-6 rounded-2xl md:rounded-3xl border border-border/60 bg-card/60 p-3 md:p-4 shadow-lg backdrop-blur overflow-x-auto">
        <div className="flex min-w-full gap-2 md:gap-4">
          {progressSteps.map((step, index) => {
            const isDone = step.status === 'done';
            const isCurrent = step.status === 'current';

            return (
              <div
                key={step.label}
                className={`flex min-w-[160px] md:min-w-[180px] flex-1 items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border px-3 md:px-4 py-2 md:py-3 transition-colors ${
                  isDone
                    ? 'border-primary bg-primary/10 text-primary'
                    : isCurrent
                      ? 'border-primary text-primary'
                      : 'border-border/60 text-muted-foreground'
                }`}
              >
                <div
                  className={`flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full text-sm md:text-base font-semibold flex-shrink-0 ${
                    isDone
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : index + 1}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs md:text-sm font-semibold truncate">{step.label}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground truncate">{step.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="rounded-2xl md:rounded-3xl border border-border/40 bg-card/80 backdrop-blur-md shadow-2xl">
        <CardHeader className="text-center space-y-2 md:space-y-3 p-4 md:p-6">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 md:p-3 rounded-full bg-primary/10">
              <HandHeart className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-headline">Lar Temporário para {animal.name}</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Preencha o formulário abaixo para se oferecer como lar temporário.
          </CardDescription>
        </CardHeader>

        {/* Info Card - Mobile Optimized */}
        <div className="px-4 md:px-6 pb-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <Info className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                  <p className="font-semibold">Sem custos para você!</p>
                  <p className="text-muted-foreground">
                    Como lar temporário, você não terá gastos. Forneceremos ração, medicamentos e arcaremos com todas as despesas veterinárias. Você apenas oferece um lar seguro até encontrarmos uma família definitiva.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold border-b pb-2">Informações Pessoais</h3>
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} className="text-sm md:text-base" />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" {...field} className="text-sm md:text-base" />
                        </FormControl>
                        <FormMessage className="text-xs md:text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base">Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} className="text-sm md:text-base" />
                        </FormControl>
                        <FormMessage className="text-xs md:text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número, bairro, cidade" {...field} className="text-sm md:text-base" />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="residenceType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm md:text-base">Tipo de Residência</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col sm:flex-row gap-4">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Casa" />
                            </FormControl>
                            <FormLabel className="font-normal text-sm md:text-base cursor-pointer">Casa</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Apartamento" />
                            </FormControl>
                            <FormLabel className="font-normal text-sm md:text-base cursor-pointer">Apartamento</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Foster-Specific Section */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold border-b pb-2">Sobre Você e o Acolhimento</h3>

                <FormField
                  control={form.control}
                  name="hasOtherPets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">Possui outros animais?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Sim ou não. Se sim, quais e quantos?"
                          className="min-h-[80px] text-sm md:text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">Por quanto tempo pode acolher?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informe sua disponibilidade (ex: alguns meses, até adoção definitiva, etc.)"
                          className="min-h-[80px] text-sm md:text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs md:text-sm">
                        Não há tempo mínimo ou máximo, queremos saber sua disponibilidade real.
                      </FormDescription>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">Experiência com animais</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conte-nos sobre sua experiência cuidando de animais..."
                          className="min-h-[100px] md:min-h-[120px] text-sm md:text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Agreement Section */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold border-b pb-2">Termo de Compromisso</h3>
                
                <FormField
                  control={form.control}
                  name="agreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3 md:p-4 bg-muted/30">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs md:text-sm font-normal cursor-pointer">
                          Concordo em acolher temporariamente {animal.name} e seguir as orientações da organização. Entendo que receberemos todo suporte necessário (ração, medicamentos, veterinário) e que o animal está sob nossa guarda temporária até adoção definitiva.
                        </FormLabel>
                        <FormMessage className="text-xs md:text-sm" />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* hCaptcha Section */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold border-b pb-2">Verificação de Segurança</h3>
                {siteKeyLoading && <p className="text-sm text-muted-foreground">Carregando verificação...</p>}
                {siteKeyError && (
                  <div className="rounded-lg bg-destructive/10 p-3 md:p-4 text-xs md:text-sm text-destructive">
                    {siteKeyError}
                  </div>
                )}
                {!siteKeyLoading && !siteKeyError && siteKey && (
                  <div ref={hcaptchaContainer} className="flex justify-center" />
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full py-5 md:py-6 text-base md:text-lg font-bold"
                disabled={isSubmitting || !hasCaptcha}
              >
                <HandHeart className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Enviando...' : `Quero Acolher ${animal.name}`}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
