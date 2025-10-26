'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, applyActionCode } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MailCheck, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationState, setVerificationState] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string>('');
  const auth = getAuth();
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;

    const verifyEmail = async () => {
      if (!oobCode) {
        setVerificationState('error');
        setError('Código de verificação não encontrado.');
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setVerificationState('success');
        
        // Redirecionar após 15 segundos
        redirectTimer = setTimeout(() => {
          router.push('/login');
        }, 15000);
      } catch (error: any) {
        console.error('Erro na verificação:', error);
        setVerificationState('error');
        setError(error.message || 'Não foi possível verificar seu email.');
      }
    };

    verifyEmail();

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [oobCode, auth, router]);

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-8rem)] bg-muted/40 px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(94,53,177,0.18),_transparent_55%)]" aria-hidden />
      <div className="mx-auto max-w-md">
        <Card className="border border-border/60 bg-card/80 shadow-lg">
          <CardHeader className="text-center">
            <Badge variant="outline" className="mx-auto mb-2 w-fit border-primary/50 text-primary">
              <MailCheck className="mr-1 h-3.5 w-3.5" /> Verificação de Email
            </Badge>
            <CardTitle className="text-2xl">
              {verificationState === 'verifying' && 'Verificando seu email...'}
              {verificationState === 'success' && 'Email verificado!'}
              {verificationState === 'error' && 'Falha na verificação'}
            </CardTitle>
            <CardDescription>
              {verificationState === 'verifying' && 'Aguarde enquanto confirmamos seu endereço de email.'}
              {verificationState === 'success' && 'Seu email foi confirmado com sucesso. Você já pode fazer login.'}
              {verificationState === 'error' && 'Não foi possível verificar seu email. Tente novamente ou solicite um novo link.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {verificationState === 'verifying' && (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {verificationState === 'success' && (
              <Alert className="border-primary/30 bg-primary/5">
                <MailCheck className="h-4 w-4" />
                <AlertTitle>Email verificado com sucesso!</AlertTitle>
                <AlertDescription>
                  Você será redirecionado para a página de login em 15 segundos.
                </AlertDescription>
              </Alert>
            )}

            {verificationState === 'error' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro na verificação</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}