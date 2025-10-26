'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, sendPasswordResetEmail, verifyBeforeUpdateEmail } from 'firebase/auth';
import { doc, type DocumentReference } from 'firebase/firestore';

import { useDoc, useFirestore, useUser } from '@/firebase';
import type { User as AppUser } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MailCheck, RefreshCw, Shield, User as UserIcon } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Informe um email válido.'),
});

export default function ProfilePage() {
  const { user, loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const auth = getAuth();
  const { toast } = useToast();
  const [statusAlert, setStatusAlert] = useState<{
    variant?: 'default' | 'destructive';
    title: string;
    description: string;
  } | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  const userDocRef = useMemo(
    () => (firestore && user ? (doc(firestore, 'users', user.uid) as DocumentReference<AppUser>) : null),
    [firestore, user]
  );
  const { data: appUser } = useDoc<AppUser>(userDocRef);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: user?.email ?? '' },
  });

  useEffect(() => {
    emailForm.reset({ email: user?.email ?? '' });
  }, [user, emailForm]);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({
        variant: 'destructive',
        title: 'Email não encontrado',
        description: 'Faça login novamente para sincronizar suas informações.',
      });
      return;
    }

    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({ title: 'Enviamos um link', description: `Confira ${user.email}` });
      setStatusAlert({
        variant: 'default',
        title: 'Email de redefinição enviado',
        description: 'Caso não encontre, busque em promoções ou spam.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Não conseguimos enviar o link',
        description: error?.message || 'Tente novamente em instantes.',
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const onSubmitEmail = emailForm.handleSubmit(async (values) => {
    if (!auth.currentUser) {
      toast({ variant: 'destructive', title: 'Sessão expirada', description: 'Faça login novamente.' });
      router.push('/login');
      return;
    }

    setIsUpdatingEmail(true);
    try {
      await verifyBeforeUpdateEmail(auth.currentUser, values.email);
      toast({
        title: 'Confirme o novo email',
        description: `Enviamos um link para ${values.email}. Siga as instruções para concluir a alteração.`,
      });
      setStatusAlert({
        variant: 'default',
        title: 'Email em atualização',
        description: 'Assim que confirmar o novo endereço, ele será aplicado em todos os acessos.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar email',
        description: error?.message || 'Talvez seja necessário entrar novamente e tentar de novo.',
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  });

  if (loading || !user) {
    return (
      <div className="container mx-auto py-16 text-center text-muted-foreground">
        Preparando suas preferências...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="space-y-2">
        <Badge variant="outline" className="border-primary/50 text-primary">
          Perfil e segurança
        </Badge>
        <h1 className="text-3xl font-headline font-semibold">Gerencie sua conta</h1>
        <p className="text-sm text-muted-foreground">
          Atualize email, dispare redefinições de senha e mantenha seus dados alinhados independente do seu papel.
        </p>
      </div>

      {statusAlert && (
        <Alert className="mt-6 border-primary/30 bg-primary/5">
          <MailCheck className="h-4 w-4" />
          <AlertTitle>{statusAlert.title}</AlertTitle>
          <AlertDescription>{statusAlert.description}</AlertDescription>
        </Alert>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
            <CardDescription>Informações sincronizadas com seu perfil.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <UserIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{user.displayName || appUser?.displayName || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <MailCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium break-all">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Papel</p>
                <p className="font-medium">{appUser?.role === 'operator' ? 'Operador' : appUser?.role === 'shelterAdmin' ? 'Admin (abrigo)' : 'Usuário'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Senha e recuperação</CardTitle>
            <CardDescription>Enviaremos automaticamente para {user.email}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use o botão abaixo sempre que precisar redefinir sua senha. Você pode compartilhar o link com a equipe de suporte se necessário.
            </p>
            <Button onClick={handlePasswordReset} disabled={isSendingReset} className="w-full sm:w-fit">
              <RefreshCw className="mr-2 h-4 w-4" /> {isSendingReset ? 'Enviando...' : 'Enviar link de redefinição'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Atualizar email</CardTitle>
            <CardDescription>
              Informe um novo endereço para onde enviaremos um link de confirmação. 
              <span className="text-destructive font-medium block mt-1">
                Verifique também a caixa de spam ou a aba de promoções caso não receba o email.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...emailForm}>
              <form onSubmit={onSubmitEmail} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Novo email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="novo-email@exemplo.com" {...field} disabled={isUpdatingEmail} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isUpdatingEmail}>
                  {isUpdatingEmail ? 'Enviando confirmação...' : 'Enviar link de confirmação'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
