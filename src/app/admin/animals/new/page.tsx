'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser, useDoc } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import type { CollectionReference, DocumentReference } from 'firebase/firestore';
import { temperamentOptions } from '@/lib/data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';
import { useRef, useMemo, useEffect } from 'react';
import type { Animal, User as AppUser } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash, ArrowLeft, Upload, X } from 'lucide-react';

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
  photos: z.array(z.string()).min(1, 'Envie ao menos uma foto.'),
  shelterId: z.string().min(1, 'ID do abrigo é obrigatório.'),
});


export default function NewAnimalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userDocRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid) as DocumentReference<AppUser>;
  }, [firestore, user]);
  const { data: appUser, loading: appUserLoading } = useDoc<AppUser>(userDocRef);

  const form = useForm<z.infer<typeof animalSchema>>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      name: '',
      species: appUser?.role === 'shelterAdmin' ? 'Cachorro' : undefined,
      breed: '',
      age: 0,
      description: '',
      story: '',
      personality: [],
      health: ['Vacinado', 'Vermifugado'],
      photos: [],
      shelterId: 'shelter-1',
    },
  });

  useEffect(() => {
    if (appUser?.role === 'shelterAdmin') {
      form.setValue('species', 'Cachorro');
    }
  }, [appUser, form]);


  const { fields: healthFields, append: appendHealth, remove: removeHealth } = useFieldArray({
    control: form.control as any,
    name: 'health',
  });
  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({
    control: form.control as any,
    name: 'photos',
  });
  const photos = form.watch('photos');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        const img = document.createElement('img');
        img.src = result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedResult = canvas.toDataURL('image/webp', 0.8);
          appendPhoto(compressedResult);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof animalSchema>) => {
    if (!firestore || !user) return;
    const collectionRef = collection(firestore, 'animals') as CollectionReference<Animal>;
    
    addDoc(collectionRef, {
        ...values,
        createdBy: user.uid, // Add creator's UID
        createdAt: serverTimestamp(),
    }).then(() => {
        toast({
            title: 'Animal adicionado com sucesso!',
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
  
  if (userLoading || appUserLoading) {
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
          <CardTitle className="text-3xl md:text-4xl font-headline">Adicionar Novo Animal</CardTitle>
          <CardDescription>
            Preencha as informações do novo animal para adoção.
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
                    <FormItem><FormLabel>Espécie</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Cachorro">Cachorro</SelectItem>
                        <SelectItem value="Gato">Gato</SelectItem>
                        <SelectItem value="Coelho">Coelho</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                 )}/>
                 <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Sexo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Macho">Macho</SelectItem><SelectItem value="Fêmea">Fêmea</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )}/>
                 <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>Idade</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                 )}/>
               </div>

                <FormField control={form.control} name="size" render={({ field }) => (
                    <FormItem><FormLabel>Tamanho</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Pequeno">Pequeno</SelectItem><SelectItem value="Médio">Médio</SelectItem><SelectItem value="Grande">Grande</SelectItem></SelectContent></Select><FormMessage /></FormItem>
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
                                            ? field.onChange([...(field.value || []), item.id])
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
                                     <FormItem className="flex-grow"><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeHealth(index)}><Trash className="h-4 w-4" /></Button>
                            </div>
                        ))}
                     </div>
                     <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendHealth('')}>Adicionar Status</Button>
                </div>
                
                <div>
                    <FormLabel>Fotos</FormLabel>
                    <FormDescription>Faça upload das fotos do animal.</FormDescription>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                        {photoFields.map((field, index) => {
                            const photoSrc = photos?.[index];
                            if (!photoSrc) return null;
                            return (
                            <div key={field.id} className="relative aspect-square">
                                <Image
                                  src={photoSrc}
                                  alt={`Foto ${index + 1}`}
                                  fill
                                  unoptimized
                                  className="rounded-md object-cover"
                                />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 z-10" onClick={() => removePhoto(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )})}
                         <Button type="button" variant="outline" className="aspect-square flex items-center justify-center flex-col gap-2 p-2 text-center" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="h-8 w-8" />
                            <span className="text-xs">Adicionar Fotos</span>
                        </Button>
                    </div>
                     <FormControl>
                        <Input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple/>
                     </FormControl>
                     <FormField control={form.control} name="photos" render={({ field }) => (
                        <FormItem><FormMessage /></FormItem>
                     )} />
                </div>
                
                <FormField control={form.control} name="shelterId" render={({ field }) => (
                    <FormItem><FormLabel>ID do Abrigo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />


              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-5 w-5" /> {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Novo Animal'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
