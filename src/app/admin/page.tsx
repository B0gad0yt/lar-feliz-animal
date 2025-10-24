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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash, Edit, Settings, Home, Bone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Animal, User as AppUser } from '@/lib/types';


function AdminDashboard() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const animalsQuery = useMemo(() => firestore ? collection(firestore, 'animals') : null, [firestore]);
  const { data: animals, loading: animalsLoading } = useCollection<Animal>(animalsQuery);

  const handleDelete = (animalId: string) => {
    if (!firestore) return;
    if (confirm('Tem certeza que deseja excluir este animal?')) {
        const docRef = doc(firestore, 'animals', animalId);
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
        });
    }
  };

  if (animalsLoading) {
     return <div className="text-center">Carregando animais...</div>;
  }
  
  return (
    <main className="md:col-span-3">
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
                                                <DropdownMenuItem onClick={() => handleDelete(animal.id as string)} className="text-destructive cursor-pointer">
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
        </Card>
    </main>
  )
}


export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemo(() => firestore && user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: appUser, loading: appUserLoading } = useDoc<AppUser>(userDocRef);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Só tomar uma decisão quando ambos os carregamentos terminarem.
    if (userLoading || appUserLoading) {
      return;
    }

    // Se o carregamento terminou, paramos de verificar.
    setIsVerifying(false);

    // Se não há usuário autenticado, redireciona para login.
    if (!user) {
      router.push('/login');
      return;
    }

    // Se o usuário está autenticado, mas seu perfil não existe ou não é admin, redireciona para a home.
    if (!appUser || appUser.role !== 'admin') {
      router.push('/');
      return;
    }

    // Se passou por todas as verificações, o usuário é um admin autorizado.
    setIsAuthorized(true);

  }, [user, userLoading, appUser, appUserLoading, router]);
  
  if (isVerifying || !isAuthorized) {
    return <div className="container mx-auto text-center py-12">Verificando autorização...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
       <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Painel de Administração</h1>
        {/* Placeholder for future global actions or settings */}
      </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-2 sticky top-24">
            <Button variant="ghost" className="justify-start text-lg bg-accent">
              <Bone className="mr-2 h-5 w-5" />
              Animais
            </Button>
            <Button variant="ghost" className="justify-start text-lg" disabled>
              <Home className="mr-2 h-5 w-5" />
              Abrigos
            </Button>
             <Button variant="ghost" className="justify-start text-lg" disabled>
              <Settings className="mr-2 h-5 w-5" />
              Configurações
            </Button>
          </nav>
        </aside>
        
        <AdminDashboard />

       </div>
    </div>
  );
}
