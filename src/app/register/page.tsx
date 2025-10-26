'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { User as AppUser } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Sparkles, UserPlus } from 'lucide-react';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { HCaptchaChallenge } from '@/components/hcaptcha/challenge';
import { AuthMarketingPanel } from '@/components/auth/marketing-panel';

const registerSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres.'),
    email: z.string().email('Email inválido.'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const auth = getAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const requestNewCaptcha = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaResetKey((prev) => prev + 1);
  }, []);

  const verifyCaptcha = useCallback(async () => {
    if (!captchaToken) {
      toast({
        variant: 'destructive',
        title: 'Confirme o hCaptcha',
        description: 'Resolva o desafio para concluir seu cadastro.',
      });
      return false;
    }

    const tokenToVerify = captchaToken;

    try {
      const res = await fetch('/api/hcaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToVerify }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const details = data?.data?.['error-codes']?.join(', ');
        toast({
          variant: 'destructive',
          title: 'Verificação falhou',
          description: details ? `hCaptcha retornou: ${details}` : 'Não foi possível validar o hCaptcha.',
        });
        requestNewCaptcha();
        return false;
      }
      requestNewCaptcha();
      return true;
    } catch (error) {
      console.error('Erro ao validar hCaptcha', error);
      toast({
        variant: 'destructive',
        title: 'Falha na verificação',
        description: 'Não conseguimos validar o hCaptcha. Tente novamente.',
      });
      requestNewCaptcha();
      return false;
    }
  }, [captchaToken, requestNewCaptcha, toast]);

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    const isHuman = await verifyCaptcha();
    if (!isHuman) {
      setIsLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: values.name });

      // Enviar email de verificação
      await sendEmailVerification(user);

      if (firestore) {
        const userDocRef = doc(firestore, 'users', user.uid) as DocumentReference<AppUser>;
        const newUser: AppUser = {
            uid: user.uid,
            email: user.email,
            displayName: values.name,
            photoURL: user.photoURL,
            role: 'user' // Default role
        };
        
        setDoc(userDocRef, newUser).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: newUser,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
      }
      
      toast({
        title: 'Cadastro realizado!',
        description: 'Enviamos um email de verificação. Confirme seu email para acessar o sistema.'
      });
      
      // Fazer logout para forçar a verificação
      setShowVerificationAlert(true);
      await auth.signOut();
      
      // Dar tempo para o usuário ler o alerta antes de redirecionar
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: getAuthErrorMessage(error, 'Não foi possível criar sua conta.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-8rem)] bg-muted/40 px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(94,53,177,0.18),_transparent_55%)]" aria-hidden />
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl backdrop-blur lg:grid-cols-[1.2fr,1fr]">
        <AuthMarketingPanel />

        <section className="p-6 sm:p-8">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary/50 text-primary">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Nova conta
            </Badge>
            <h1 className="text-3xl font-headline font-semibold">Crie sua conta</h1>
            <p className="text-sm text-muted-foreground">
              Cadastre-se para salvar favoritos, acompanhar pedidos e colaborar com a comunidade de adoção responsável.
            </p>
          </div>

          {showVerificationAlert && (
            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Verifique seu email</AlertTitle>
              <AlertDescription>
                Enviamos um link de confirmação para seu email. Você precisa verificar seu email antes de fazer login.
                Por favor, verifique também sua caixa de spam.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mt-6 border border-border/60 bg-card/80 shadow-lg">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} disabled={isLoading} />
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
                          <Input type="email" placeholder="seu@email.com" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormDescription>Usaremos seu email apenas para contatos importantes.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Mínimo 6 caracteres" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormDescription>Combine letras, números e símbolos para reforçar a segurança.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <HCaptchaChallenge
                    onTokenChange={setCaptchaToken}
                    resetSignal={captchaResetKey}
                    description="Confirme que você é humano para concluir o cadastro."
                  />
                  <Button type="submit" className="w-full" disabled={isLoading || !captchaToken}>
                    <UserPlus className="mr-2 h-4 w-4" /> {isLoading ? 'Cadastrando...' : 'Criar conta'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?
            <Link href="/login" className="ml-1 font-medium text-primary underline-offset-4 hover:underline">
              Faça login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
