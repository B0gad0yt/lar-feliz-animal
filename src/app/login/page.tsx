'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  type UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { User as AppUser } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, LogIn, MailCheck, RefreshCw, Sparkles } from 'lucide-react';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { HCaptchaChallenge } from '@/components/hcaptcha/challenge';
import { AuthMarketingPanel } from '@/components/auth/marketing-panel';

const loginSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.8 0-5.18-1.89-6.04-4.42H2.34v2.84C4.12 20.98 7.78 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.96 14.28c-.2-.6-.31-1.25-.31-1.92s.11-1.32.31-1.92V7.6H2.34c-.66 1.32-1.04 2.8-1.04 4.48s.38 3.16 1.04 4.48l3.62-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.78 1 4.12 3.02 2.34 6.08l3.62 2.84c.86-2.53 3.24-4.42 6.04-4.42z"
    />
  </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [showVerificationNeeded, setShowVerificationNeeded] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{
    variant?: 'default' | 'destructive';
    title: string;
    description: string;
  } | null>(null);

  // Mostrar alerta se vier do registro ou se tentou acessar sem verificar
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'email-not-verified') {
      setShowVerificationNeeded(true);
    }
  }, [searchParams]);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const auth = getAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
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
        description: 'Resolva o desafio antes de continuar.',
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

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!email) {
      form.setError('email', { type: 'manual', message: 'Informe seu email para recuperar a senha.' });
      return;
    }

    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: 'Link enviado', description: 'Verifique sua caixa de entrada e siga as instruções.' });
      setStatusAlert({
        variant: 'default',
        title: 'Email de redefinição enviado',
        description: 'Caso não encontre, confira a pasta de spam ou utilize outro endereço.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Não foi possível enviar o link',
        description: getAuthErrorMessage(error, 'Confira se o email está correto.'),
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const isHuman = await verifyCaptcha();
    if (!isHuman) {
      setIsLoading(false);
      return;
    }
    try {
      setStatusAlert(null);
      const credential = await signInWithEmailAndPassword(auth, values.email, values.password);

      if (!credential.user.emailVerified) {
        try {
          await sendEmailVerification(credential.user);
          toast({
            title: 'Confirme seu email',
            description: 'Enviamos um novo link de verificação. Após confirmar, faça login novamente.',
          });
          setStatusAlert({
            variant: 'default',
            title: 'Email pendente de verificação',
            description: 'Abra o link enviado agora há pouco para liberar o acesso ao painel.',
          });
        } catch (verificationError: any) {
          console.error(verificationError);
          toast({
            variant: 'destructive',
            title: 'Não foi possível reenviar o email',
            description: getAuthErrorMessage(verificationError, 'Tente novamente em alguns instantes.'),
          });
        } finally {
          await auth.signOut();
        }
        return;
      }

      toast({ title: 'Login realizado com sucesso!' });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: getAuthErrorMessage(error, 'Verifique seu email e senha.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processUserSignIn = async (userCredential: UserCredential) => {
    const user = userCredential.user;
    if (firestore) {
      const userDocRef = doc(firestore, 'users', user.uid) as DocumentReference<AppUser>;
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUser: AppUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'user'
        };
        // This setDoc will now correctly emit a contextual error if it fails
        setDoc(userDocRef, newUser).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: newUser,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
      }
    }
    toast({ title: 'Login com Google realizado com sucesso!' });
    router.push('/');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const isHuman = await verifyCaptcha();
    if (!isHuman) {
      setIsLoading(false);
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const credential = await signInWithPopup(auth, provider);
      await processUserSignIn(credential);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      toast({
        variant: 'destructive',
        title: 'Erro no login com Google',
        description: getAuthErrorMessage(error, 'Não foi possível autenticar com o Google.'),
      });
    } finally {
      // Em sucesso, o redirect acontece rapidamente, mas garantimos que o estado volte caso o usuário permaneça na página
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-8rem)] bg-muted/40 px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.15),_transparent_55%)]" aria-hidden />
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl backdrop-blur lg:grid-cols-[1.2fr,1fr]">
        <AuthMarketingPanel />

        <section className="p-6 sm:p-8">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary/50 text-primary">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Experiência renovada
            </Badge>
            <h1 className="text-3xl font-headline font-semibold">Entre no painel</h1>
            <p className="text-sm text-muted-foreground">
              Valide seu email, conclua o hCaptcha e destrave todos os recursos para operadores e abrigos.
            </p>
          </div>

          {statusAlert && (
            <Alert variant={statusAlert.variant} className="mt-6 border-primary/40 bg-primary/5">
              <MailCheck className="h-4 w-4" />
              <AlertTitle>{statusAlert.title}</AlertTitle>
              <AlertDescription>{statusAlert.description}</AlertDescription>
            </Alert>
          )}

          {showVerificationNeeded && (
            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Email não verificado</AlertTitle>
              <AlertDescription>
                Você precisa verificar seu email antes de fazer login. 
                Verifique sua caixa de entrada e spam. Se necessário, tente fazer login para receber um novo link de verificação.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mt-6 border border-border/60 bg-card/80 shadow-lg">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Senha</FormLabel>
                          <Button
                            type="button"
                            variant="link"
                            className="px-0 text-xs font-semibold"
                            onClick={handlePasswordReset}
                            disabled={isResettingPassword}
                          >
                            <RefreshCw className="mr-1 h-3.5 w-3.5" />
                            {isResettingPassword ? 'Enviando...' : 'Esqueci minha senha'}
                          </Button>
                        </div>
                        <FormControl>
                          <Input type="password" placeholder="Sua senha" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <HCaptchaChallenge
                    onTokenChange={setCaptchaToken}
                    resetSignal={captchaResetKey}
                    description="Resolva o desafio para liberar o acesso ao login."
                  />
                  <Button type="submit" className="w-full" disabled={isLoading || !captchaToken}>
                    <LogIn className="mr-2 h-4 w-4" /> {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </Form>

              <div className="relative my-2 text-center text-xs uppercase text-muted-foreground">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2">
                  Ou continue com
                </span>
              </div>

              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || !captchaToken}>
                <GoogleIcon /> Google
              </Button>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?
            <Link href="/register" className="ml-1 font-medium text-primary underline-offset-4 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
