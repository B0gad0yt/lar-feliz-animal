'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useDoc, useUser } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { temperamentOptions } from '@/lib/data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash, ArrowLeft } from 'lucide-react';
import type { Animal } from '@/lib/types';


const animalSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório.'),
  species: z.enum(['Cachorro', 'Gato', 'Coelho'], { required_error: 'Espécie é obrigatória.' }),
  breed: z.string().min(2, 'Raça é obrigatória.'),
  age: z.coerce.number().min(0, 'Idade não pode ser negativa.'),
  size: z.enum(['Pequeno', 'Médio', 'Grande'], { required_error: 'Tamanho é obrigatório.' }),
  gender: z.enum(['Macho', 'Fêmea'], { required_error: 'Sexo é obrigatório.' }),
  description: z.string().min(10, 'Descrição é obrigatória.'),
  story: z.string().min(10, 'História é obrigatória.'),
  personality: z.array(z.string()).min(1, 'Selecione ao menos um traço de personalidade.'),
  health: z.array(z.string()).min(1, 'Informe ao menos um status de saúde.'),
  photos: z.array(z.string()).min(1, 'Informe ao menos uma foto (ID da imagem).'),
  shelterId: z.string().min(1, 'ID do abrigo é obrigatório.'),
});


export default function EditAnimalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();
  
  const animalRef = firestore ? doc(firestore, 'animals', params.id) : null;
  const { data: animal, loading: animalLoading } = useDoc<Animal>(animalRef);

  const form = useForm<z.infer<typeof animalSchema>>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      personality: [],
      health: [],
      photos: [],
    }
  });

  const { fields: healthFields, append: appendHealth, remove: removeHealth } = useFieldArray({ control: form.control, name: "health" });
  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({ control: form.control, name: "photos" });

  useEffect(() => {
    if (animal) {
      form.reset(animal);
    }
  }, [animal, form]);

  const onSubmit = async (values: z.infer<typeof animalSchema>) => {
    if (!firestore || !animalRef) return;
    
    setDoc(animalRef, {
        ...values,
        updatedAt: serverTimestamp(),
    }, { merge: true }).then(() => {
        toast({
            title: 'Animal atualizado com sucesso!',
        });
        router.push('/admin');
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: animalRef.path,
            operation: 'update',
            requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  };
  
  if (userLoading || animalLoading) {
    return <div className="container mx-auto text-center py-12">Carregando...</div>;
  }
  
  // Acesso é verificado pelas regras do Firestore. Um toast de erro aparecerá se o usuário não for admin.
  // Redirecionamos se o usuário não estiver logado.
  if (!user) {
    router.push('/login');
    return null;
  }
  
  if (!animal && !animalLoading) {
      return <div className="container mx-auto text-center py-12">Animal não encontrado.</div>;
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
          <CardTitle className="text-3xl md:text-4xl font-headline">Editar Animal</CardTitle>
          <CardDescription>
            Atualize as informações de <span className="font-bold text-primary">{animal?.name}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="breed" render={({ field }) => (
                    <FormItem><FormLabel>Raça</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FormField control={form.control} name="species" render={({ field }) => (
                    <FormItem><FormLabel>Espécie</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Cachorro">Cachorro</SelectItem><SelectItem value="Gato">Gato</SelectItem><SelectItem value="Coelho">Coelho</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )}/>
                 <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Sexo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Macho">Macho</SelectItem><SelectItem value="Fêmea">Fêmea</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )}/>
                 <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>Idade</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                 )}/>
               </div>

                <FormField control={form.control} name="size" render={({ field }) => (
                    <FormItem><FormLabel>Tamanho</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Pequeno">Pequeno</SelectItem><SelectItem value="Médio">Médio</SelectItem><SelectItem value="Grande">Grande</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>

                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="story" render={({ field }) => (
                    <FormItem><FormLabel>História</FormLabel><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>

                <FormField control={form.control} name="personality" render={() => (
                    <FormItem>
                        <FormLabel>Personalidade</FormLabel>
                        <FormDescription>Selecione os traços que melhor descrevem o animal.</FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                        {temperamentOptions.map((item) => (
                            <FormField key={item.id} control={form.control} name="personality"
                            render={({ field }) => (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...field.value, item.id])
                                            : field.onChange(field.value?.filter((value) => value !== item.id))
                                        }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                            )} />
                        ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}/>

                <div>
                    <FormLabel>Saúde</FormLabel>
                    <FormDescription>Adicione o status de saúde (ex: Vacinado, Castrado).</FormDescription>
                     <div className="space-y-2 mt-2">
                        {healthFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <FormField control={form.control} name={`health.${index}`} render={({ field }) => (
                                    <FormItem className="flex-grow"><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeHealth(index)}><Trash className="h-4 w-4" /></Button>
                            </div>
                        ))}
                     </div>
                     <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendHealth('')}>Adicionar Status</Button>
                </div>
                
                <div>
                    <FormLabel>Fotos</FormLabel>
                    <FormDescription>Adicione os IDs das imagens do arquivo placeholder-images.json.</FormDescription>
                     <div className="space-y-2 mt-2">
                        {photoFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <FormField control={form.control} name={`photos.${index}`} render={({ field }) => (
                                    <FormItem className="flex-grow"><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removePhoto(index)}><Trash className="h-4 w-4" /></Button>
                            </div>
                        ))}
                     </div>
                     <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendPhoto('')}>Adicionar Foto</Button>
                </div>
                
                <FormField control={form.control} name="shelterId" render={({ field }) => (
                    <FormItem><FormLabel>ID do Abrigo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />


              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-5 w-5" /> {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
