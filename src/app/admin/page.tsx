'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useCollection, useDoc } from '@/firebase';
import { collection, doc, deleteDoc, setDoc, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useMemo } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import * as z from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash, Edit, Settings, Home, Bone, ShieldAlert, ArrowLeft, Save, Globe, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Animal, User as AppUser, Shelter, SiteConfig } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


function AnimalsTab({ appUser }: { appUser: AppUser }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const animalsQuery = useMemo(() => {
    if (!firestore || !appUser) return null;
    const animalsCollection = collection(firestore, 'animals');
    if (appUser.role === 'operator') {
      return animalsCollection;
    }
    // For shelterAdmin, filter by createdBy
    return query(animalsCollection, where("createdBy", "==", appUser.uid));
  }, [firestore, appUser]);

  const { data: animals, loading: animalsLoading } = useCollection<Animal>(animalsQuery);

  const handleDelete = () => {
    if (!firestore || !itemToDelete) return;
    
    const docRef = doc(firestore, 'animals', itemToDelete);
    
    deleteDoc(docRef).then(() => {
        toast({
            title: 'Animal excluído com sucesso!',
        });
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
        setItemToDelete(null); 
    });
  };

  if (animalsLoading) {
     return <div className="text-center p-8">Carregando animais...</div>;
  }
  
  return (
    <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <CardTitle>Gerenciar Animais</CardTitle>
                <CardDescription>Adicione, edite ou remova animais do sistema.</CardDescription>
            </div>
            <Button asChild className="w-full md:w-auto">
                <Link href="/admin/animals/new">
                    <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Animal
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Imagem</span>
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Espécie</TableHead>
                            <TableHead className="hidden md:table-cell">Idade</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead>
                                <span className="sr-only">Ações</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {animals && animals.map((animal) => {
                            return (
                                <TableRow key={animal.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        {animal.photos[0] && <Image
                                        alt={animal.name}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={animal.photos[0]}
                                        width="64"
                                        />}
                                    </TableCell>
                                    <TableCell className="font-medium">{animal.name}</TableCell>
                                    <TableCell>{animal.species}</TableCell>
                                    <TableCell className="hidden md:table-cell">{animal.age} {animal.age > 1 ? 'anos' : 'ano'}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline">Disponível</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild><Link href={`/admin/animals/edit/${animal.id}`} className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />Editar
                                                </Link></DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive cursor-pointer" onSelect={() => setItemToDelete(animal.id as string)}>
                                                    <Trash className="mr-2 h-4 w-4" />Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
           </div>
        </CardContent>
        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso excluirá permanentemente o
                        animal de nossos servidores.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </Card>
  )
}

function UsersTab() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const usersQuery = useMemo(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: users, loading: usersLoading, error } = useCollection<AppUser>(usersQuery);

  const handleRoleChange = (user: AppUser, newRole: AppUser['role']) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);
    setDoc(userRef, { role: newRole }, { merge: true })
      .then(() => {
        toast({ title: "Cargo atualizado com sucesso!" });
      })
      .catch((error) => {
        // The permission error will be caught by the global listener now
        console.error("Error updating user role: ", error);
        toast({ variant: 'destructive', title: "Erro ao atualizar cargo." });
      });
  };

  if (usersLoading) {
     return <div className="text-center p-8">Carregando usuários...</div>;
  }
  
  return (
    <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <CardDescription>Edite os cargos dos usuários do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Cargo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users && users.map((user) => (
                            <TableRow key={user.uid}>
                                <TableCell className="font-medium">{user.displayName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Select
                                        value={user.role}
                                        onValueChange={(value) => handleRoleChange(user, value as AppUser['role'])}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Selecione um cargo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">Usuário</SelectItem>
                                            <SelectItem value="shelterAdmin">Admin (Abrigo)</SelectItem>
                                            <SelectItem value="operator">Operador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
  )
}

function SheltersTab() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const sheltersQuery = useMemo(() => firestore ? collection(firestore, 'shelters') : null, [firestore]);
  const { data: shelters, loading: sheltersLoading } = useCollection<Shelter>(sheltersQuery);

  const handleDelete = () => {
    if (!firestore || !itemToDelete) return;
    
    const docRef = doc(firestore, 'shelters', itemToDelete);
    
    deleteDoc(docRef).then(() => {
        toast({ title: 'Abrigo excluído com sucesso!' });
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
        setItemToDelete(null); 
    });
  };

  if (sheltersLoading) {
     return <div className="text-center p-8">Carregando abrigos...</div>;
  }
  
  return (
    <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <CardTitle>Gerenciar Abrigos</CardTitle>
                <CardDescription>Adicione, edite ou remova abrigos parceiros.</CardDescription>
            </div>
            <Button asChild className="w-full md:w-auto">
                <Link href="/admin/shelters/new">
                    <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Abrigo
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden md:table-cell">Telefone</TableHead>
                            <TableHead>
                                <span className="sr-only">Ações</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shelters && shelters.map((shelter) => (
                            <TableRow key={shelter.id}>
                                <TableCell className="font-medium">{shelter.name}</TableCell>
                                <TableCell>{shelter.email}</TableCell>
                                <TableCell className="hidden md:table-cell">{shelter.phone}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild><Link href={`/admin/shelters/edit/${shelter.id}`} className="cursor-pointer">
                                                <Edit className="mr-2 h-4 w-4" />Editar
                                            </Link></DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive cursor-pointer" onSelect={() => setItemToDelete(shelter.id as string)}>
                                                <Trash className="mr-2 h-4 w-4" />Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso excluirá permanentemente o abrigo.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </Card>
  )
}

const siteConfigSchema = z.object({
  title: z.string().min(1, 'Título do site é obrigatório.'),
  socialLinks: z.array(z.object({
    platform: z.enum(["Instagram", "Twitter", "Facebook", "YouTube", "LinkedIn", "GitHub", "TikTok"]),
    url: z.string().url('URL inválida.')
  })).optional()
});


function SettingsTab() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const configRef = useMemo(() => firestore ? doc(firestore, 'config', 'site') : null, [firestore]);
  const { data: siteConfig, loading: configLoading } = useDoc<SiteConfig>(configRef);

  const form = useForm<z.infer<typeof siteConfigSchema>>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: {
      title: '',
      socialLinks: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'socialLinks',
  });

  useEffect(() => {
    if (siteConfig) {
      form.reset({
        title: siteConfig.title || '',
        socialLinks: siteConfig.socialLinks || []
      });
    }
  }, [siteConfig, form]);

  const onSubmit = (values: z.infer<typeof siteConfigSchema>) => {
    if (!configRef) return;

    setDoc(configRef, values, { merge: true }).then(() => {
      toast({ title: 'Configurações salvas com sucesso!' });
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: configRef.path,
            operation: 'update',
            requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  };

  if (configLoading) {
    return <div className="text-center p-8">Carregando configurações...</div>;
  }

  return (
      <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
              <CardTitle>Configurações do Site</CardTitle>
              <CardDescription>Altere informações globais do site, como título e links de redes sociais.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Site</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Este é o título principal que aparece no cabeçalho e na aba do navegador.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Links de Redes Sociais</FormLabel>
                  <FormDescription>Adicione ou remova os links que aparecem no rodapé.</FormDescription>
                  <div className="space-y-4 mt-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-4 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full flex-grow">
                          <FormField
                            control={form.control}
                            name={`socialLinks.${index}.platform`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Plataforma" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    <SelectItem value="Instagram">Instagram</SelectItem>
                                    <SelectItem value="Twitter">Twitter</SelectItem>
                                    <SelectItem value="Facebook">Facebook</SelectItem>
                                    <SelectItem value="YouTube">YouTube</SelectItem>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="GitHub">GitHub</SelectItem>
                                    <SelectItem value="TikTok">TikTok</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`socialLinks.${index}.url`}
                            render={({ field }) => (
                              <FormItem><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                          />
                        </div>
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="w-full md:w-auto mt-2 md:mt-0">
                          <Trash className="h-4 w-4" />
                          <span className="md:hidden ml-2">Remover Link</span>
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ platform: 'Instagram', url: '' })}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Link
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </form>
            </Form>
          </CardContent>
      </Card>
  )
}


export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemo(() => firestore && user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: appUser, loading: appUserLoading } = useDoc<AppUser>(userDocRef);

  const [authStatus, setAuthStatus] = useState<'verifying' | 'authorized' | 'unauthorized'>('verifying');

  useEffect(() => {
    if (userLoading || appUserLoading) {
      setAuthStatus('verifying');
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!appUser || (appUser.role !== 'operator' && appUser.role !== 'shelterAdmin')) {
      setAuthStatus('unauthorized');
      return;
    }

    if (user && appUser && (appUser.role === 'operator' || appUser.role === 'shelterAdmin')) {
      setAuthStatus('authorized');
    }
  }, [user, userLoading, appUser, appUserLoading, router]);

  
  if (authStatus === 'verifying') {
    return <div className="container mx-auto text-center py-12">Verificando autorização...</div>;
  }
  
  if (authStatus === 'unauthorized') {
      return (
          <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
              <Card className="max-w-md w-full text-center bg-card/90 backdrop-blur-sm m-4">
                  <CardHeader>
                      <CardTitle className="text-2xl font-headline flex items-center justify-center">
                          <ShieldAlert className="mr-2 h-7 w-7 text-destructive" />
                          Acesso Negado
                      </CardTitle>
                      <CardDescription>
                          Você não tem permissão para acessar esta página.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p>Esta área é restrita a administradores e operadores do site. Se você acredita que isso é um erro, entre em contato com o suporte.</p>
                  </CardContent>
                  <CardFooter>
                      <Button className="w-full" onClick={() => router.push('/')}>
                          <ArrowLeft className="mr-2 h-5 w-5" />
                          Voltar para a Página Inicial
                      </Button>
                  </CardFooter>
              </Card>
          </div>
      );
  }

  // Only render the dashboard if authorized
  return (
    <div className="container mx-auto py-12 px-4">
       <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Painel de Administração</h1>
      </div>
      <Tabs defaultValue="animals" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
             <TabsList className="flex flex-col h-auto items-stretch bg-transparent p-0 w-full md:w-auto">
                <TabsTrigger value="animals" className="justify-start text-lg p-3 data-[state=active]:bg-accent data-[state=active]:shadow-none">
                  <Bone className="mr-2 h-5 w-5" />
                  Animais
                </TabsTrigger>
                {appUser?.role === 'operator' && (
                  <>
                    <TabsTrigger value="shelters" className="justify-start text-lg p-3 data-[state=active]:bg-accent data-[state=active]:shadow-none">
                      <Home className="mr-2 h-5 w-5" />
                      Abrigos
                    </TabsTrigger>
                    <TabsTrigger value="users" className="justify-start text-lg p-3 data-[state=active]:bg-accent data-[state=active]:shadow-none">
                      <Users className="mr-2 h-5 w-5" />
                      Usuários
                    </TabsTrigger>
                     <TabsTrigger value="settings" className="justify-start text-lg p-3 data-[state=active]:bg-accent data-[state=active]:shadow-none">
                      <Settings className="mr-2 h-5 w-5" />
                      Configurações
                    </TabsTrigger>
                  </>
                )}
            </TabsList>
          </aside>
          
          <main className="md:col-span-3">
              <TabsContent value="animals">
                  {appUser && <AnimalsTab appUser={appUser} />}
              </TabsContent>
               {appUser?.role === 'operator' && (
                <>
                  <TabsContent value="shelters">
                      <SheltersTab />
                  </TabsContent>
                  <TabsContent value="users">
                      <UsersTab />
                  </TabsContent>
                  <TabsContent value="settings">
                      <SettingsTab />
                  </TabsContent>
                </>
               )}
          </main>
        </div>
       </Tabs>
    </div>
  );
}
