'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { CollectionReference } from 'firebase/firestore';
import type { Shelter } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft } from 'lucide-react';

const shelterSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório.'),
  address: z.string().min(10, 'Endereço é obrigatório.'),
  phone: z.string().min(10, 'Telefone é obrigatório.'),
  email: z.string().email('Email inválido.'),
  website: z.string().url('URL do website inválida.'),
});


export default function NewShelterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();

  const form = useForm<z.infer<typeof shelterSchema>>({
    resolver: zodResolver(shelterSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof shelterSchema>) => {
    if (!firestore) return;
    const collectionRef = collection(firestore, 'shelters') as CollectionReference<Shelter>;
    
    addDoc(collectionRef, {
        ...values,
        createdAt: serverTimestamp(),
    }).then(() => {
        toast({
            title: 'Abrigo adicionado com sucesso!',
        });
        router.push('/admin');
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  };
  
  if (userLoading) {
    return <div className="container mx-auto text-center py-12">Carregando...</div>;
  }
  
  if (!user) {
    router.push('/login');
    return null;
  }


  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
       <div className="mb-8">
        <Button variant="outline" size="sm" onClick={() => router.push('/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o painel
        </Button>
      </div>
      <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-headline">Adicionar Novo Abrigo</CardTitle>
          <CardDescription>
            Preencha as informações do novo abrigo parceiro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Nome do Abrigo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Endereço</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="website" render={({ field }) => (
                  <FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />


              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-5 w-5" /> {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Novo Abrigo'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
