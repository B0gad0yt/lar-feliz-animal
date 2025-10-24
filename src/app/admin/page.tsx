'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useCollection, useDoc } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useMemo } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash, Edit, Settings, Home, Bone, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Animal, User as AppUser } from '@/lib/types';
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


function AnimalsTab() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const animalsQuery = useMemo(() => firestore ? collection(firestore, 'animals') : null, [firestore]);
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
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Gerenciar Animais</CardTitle>
                <CardDescription>Adicione, edite ou remova animais do sistema.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/admin/animals/new">
                    <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Animal
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
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
                        const image = PlaceHolderImages.find(p => p.id === animal.photos[0]);
                        return (
                            <TableRow key={animal.id}>
                                <TableCell className="hidden sm:table-cell">
                                    {image && <Image
                                    alt={animal.name}
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={image.imageUrl}
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

function SheltersTab() {
  return (
      <Card>
          <CardHeader>
              <CardTitle>Gerenciar Abrigos</CardTitle>
              <CardDescription>Funcionalidade em desenvolvimento.</CardDescription>
          </CardHeader>
          <CardContent>
              <p>Aqui você poderá adicionar, editar e remover abrigos parceiros.</p>
          </CardContent>
      </Card>
  )
}

function SettingsTab() {
  return (
      <Card>
          <CardHeader>
              <CardTitle>Configurações do Site</CardTitle>
              <CardDescription>Funcionalidade em desenvolvimento.</CardDescription>
          </CardHeader>
          <CardContent>
              <p>Aqui você poderá alterar informações globais do site, como links de redes sociais e título.</p>
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
        setAuthStatus('unauthorized');
        return;
    }

    if (user && (!appUser || appUser.role !== 'admin')) {
        setAuthStatus('unauthorized');
        return;
    }
    
    if (user && appUser && appUser.role === 'admin') {
        setAuthStatus('authorized');
    }

  }, [user, userLoading, appUser, appUserLoading]);
  
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
                      <p>Esta área é restrita a administradores do site. Se você acredita que isso é um erro, entre em contato com o suporte.</p>
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
        <h1 className="text-4xl font-bold font-headline">Painel de Administração</h1>
      </div>
      <Tabs defaultValue="animals">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
             <TabsList className="flex flex-col h-auto items-stretch bg-transparent p-0">
                <TabsTrigger value="animals" className="justify-start text-lg p-3 data-[state=active]:bg-accent data-[state=active]:shadow-none">
                  <Bone className="mr-2 h-5 w-5" />
                  Animais
                </TabsTrigger>
                <TabsTrigger value="shelters" className="justify-start text-lg p-3 data-[state=active]:bg-accent data-[state=active]:shadow-none">
                  <Home className="mr-2 h-5 w-5" />
                  Abrigos
                </TabsTrigger>
                 <TabsTrigger value="settings" className="justify-start text-lg p-3 data-[state=active]:bg-accent data-[state=active]:shadow-none">
                  <Settings className="mr-2 h-5 w-5" />
                  Configurações
                </TabsTrigger>
            </TabsList>
          </aside>
          
          <main className="md:col-span-3">
              <TabsContent value="animals">
                  <AnimalsTab />
              </TabsContent>
              <TabsContent value="shelters">
                  <SheltersTab />
              </TabsContent>
              <TabsContent value="settings">
                  <SettingsTab />
              </TabsContent>
          </main>
        </div>
       </Tabs>
    </div>
  );
}
