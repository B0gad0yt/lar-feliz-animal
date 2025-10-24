'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres.'),
    email: z.string().email('Email inválido.'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: values.name });

      if (firestore) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const newUser = {
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
      
      toast({ title: 'Cadastro realizado com sucesso!' });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: error.message || 'Não foi possível criar sua conta.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-full items-center justify-center py-12">
      <Card className="w-full max-w-md bg-card/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Crie sua Conta</CardTitle>
          <CardDescription>É rápido e fácil. Comece sua jornada de adoção!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} disabled={isLoading} />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                <UserPlus className="mr-2 h-4 w-4" /> {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Faça login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
