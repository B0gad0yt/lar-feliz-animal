'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useCollection, useDoc } from '@/firebase';
import { collection, doc, deleteDoc, setDoc, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';
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
import { MoreHorizontal, PlusCircle, Trash, Edit, Settings, Home, Bone, ShieldAlert, ArrowLeft, Save, Globe, Users, Inbox, Check, Ban, HeartHandshake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Animal, User as AppUser, Shelter, SiteConfig, AdoptionApplication } from '@/lib/types';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


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

function ApplicationsTab({ appUser }: { appUser: AppUser }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [adoptingId, setAdoptingId] = useState<string | null>(null);

  const applicationsQuery = useMemo(() => {
    if (!firestore || !appUser) return null;
    const applicationsRef = collection(firestore, 'adoptionApplications');
    if (appUser.role === 'operator') {
      return applicationsRef;
    }
    return query(applicationsRef, where('shelterAdminId', '==', appUser.uid));
  }, [firestore, appUser]);

  const { data: applications, loading: applicationsLoading } = useCollection<AdoptionApplication>(applicationsQuery);

  const pendingApplications = applications?.filter((item) => item.status === 'pending') ?? [];
  const acceptedApplications = applications?.filter((item) => item.status === 'accepted') ?? [];

  const handleStatusChange = async (application: AdoptionApplication, status: 'pending' | 'accepted' | 'adopted') => {
    if (!firestore || !application.id) return;
    setProcessingId(application.id);
    try {
      const applicationRef = doc(firestore, 'adoptionApplications', application.id);
      await updateDoc(applicationRef, {
        status,
        handledBy: appUser.uid,
        handledAt: serverTimestamp(),
      });
      toast({
        title: status === 'accepted' ? 'Pedido aceito!' : 'Pedido atualizado!',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar pedido',
        description: error?.message || 'Tente novamente mais tarde.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteApplication = async (application: AdoptionApplication) => {
    if (!firestore || !application.id) return;
    setRemovingId(application.id);
    try {
      await deleteDoc(doc(firestore, 'adoptionApplications', application.id));
      toast({ title: 'Pedido removido.' });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover pedido',
        description: error?.message || 'Tente novamente mais tarde.',
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleMarkAsAdopted = async (application: AdoptionApplication) => {
    if (!firestore || !application.id) return;
    setAdoptingId(application.id);
    try {
      await updateDoc(doc(firestore, 'adoptionApplications', application.id), {
        status: 'adopted',
        handledBy: appUser.uid,
        handledAt: serverTimestamp(),
      });

      await deleteDoc(doc(firestore, 'animals', application.animalId));

      const related = (applications ?? []).filter(
        (item) => item.animalId === application.animalId && item.id && item.id !== application.id
      );
      await Promise.all(
        related.map((item) =>
          deleteDoc(doc(firestore, 'adoptionApplications', item.id!))
        )
      );

      toast({ title: `${application.animalName} marcado como adotado!` });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao concluir adoção',
        description: error?.message || 'Tente novamente mais tarde.',
      });
    } finally {
      setAdoptingId(null);
    }
  };

  const renderApplicationCard = (application: AdoptionApplication, variant: 'pending' | 'accepted') => {
    const submittedAt = application.createdAt?.toDate ? application.createdAt.toDate().toLocaleString('pt-BR') : '—';

    return (
      <div key={application.id} className="border rounded-lg p-4 bg-background/60">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">#{application.id?.slice(0, 6)}</Badge>
              <Badge>{application.animalName}</Badge>
              <Badge variant="secondary">{application.residenceType}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Enviado em {submittedAt}</p>
            <p className="mt-3 text-base font-semibold">{application.fullName}</p>
            <p className="text-sm text-muted-foreground">{application.email} · {application.phone}</p>
          </div>
          {application.animalPhoto && (
            <div className="relative h-20 w-20 rounded-md overflow-hidden">
              <Image
                src={application.animalPhoto}
                alt={application.animalName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-4">
          <div>
            <span className="font-semibold">Endereço: </span>
            {application.address}
          </div>
          <div>
            <span className="font-semibold">Outros animais: </span>
            {application.hasOtherPets || 'Não informado'}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Motivação: </span>
            {application.reason}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {variant === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => handleStatusChange(application, 'accepted')}
                disabled={processingId === application.id}
              >
                <Check className="mr-2 h-4 w-4" />
                Aceitar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteApplication(application)}
                disabled={removingId === application.id}
              >
                <Ban className="mr-2 h-4 w-4" />
                Remover
              </Button>
            </>
          )}
          {variant === 'accepted' && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleDeleteApplication(application)}
                disabled={removingId === application.id}
              >
                <Ban className="mr-2 h-4 w-4" />
                Remover
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-500"
                onClick={() => handleMarkAsAdopted(application)}
                disabled={adoptingId === application.id}
              >
                <HeartHandshake className="mr-2 h-4 w-4" />
                Adotado
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (applicationsLoading) {
    return <div className="text-center p-8">Carregando pedidos de adoção...</div>;
  }

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Pedidos de Adoção</CardTitle>
        <CardDescription>Gerencie solicitações recebidas pelos abrigos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Pendentes</h3>
            <Badge variant="secondary">{pendingApplications.length}</Badge>
          </div>
          {pendingApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pedido pendente no momento.</p>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((application) => renderApplicationCard(application, 'pending'))}
            </div>
          )}
        </section>
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Check className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Aceitos</h3>
            <Badge variant="secondary">{acceptedApplications.length}</Badge>
          </div>
          {acceptedApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pedido aceito ainda.</p>
          ) : (
            <div className="space-y-4">
              {acceptedApplications.map((application) => renderApplicationCard(application, 'accepted'))}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

const userFormSchema = z.object({
  displayName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  role: z.enum(['user', 'shelterAdmin', 'operator']),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.').optional(),
  photoURL: z.string().url('URL inválida.').or(z.literal('')).optional(),
});
type UserFormValues = z.infer<typeof userFormSchema>;
const defaultUserFormValues: UserFormValues = {
  displayName: '',
  email: '',
  role: 'user',
  password: '',
  photoURL: '',
};

function UsersTab() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user: firebaseUser } = useUser();
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const usersQuery = useMemo(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: users, loading: usersLoading } = useCollection<AppUser>(usersQuery);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultUserFormValues,
  });

  useEffect(() => {
    if (!isDialogOpen) return;

    if (dialogMode === 'edit' && selectedUser) {
      form.reset({
        displayName: selectedUser.displayName ?? '',
        email: selectedUser.email ?? '',
        role: selectedUser.role,
        password: '',
        photoURL: selectedUser.photoURL ?? '',
      });
    } else {
      form.reset(defaultUserFormValues);
    }
  }, [dialogMode, selectedUser, isDialogOpen, form]);

  const getAuthHeaders = async () => {
    if (!firebaseUser) {
      throw new Error('Usuário não autenticado.');
    }
    const token = await firebaseUser.getIdToken();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleRoleChange = (user: AppUser, newRole: AppUser['role']) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);
    setDoc(userRef, { role: newRole }, { merge: true })
      .then(() => {
        toast({ title: "Cargo atualizado com sucesso!" });
      })
      .catch((error) => {
        console.error("Error updating user role: ", error);
        toast({ variant: 'destructive', title: "Erro ao atualizar cargo." });
      });
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const openEditDialog = (user: AppUser) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setDialogMode('create');
    form.reset(defaultUserFormValues);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!firebaseUser) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não autenticado.' });
      return;
    }

    if (dialogMode === 'create' && !values.password) {
      form.setError('password', { message: 'Informe uma senha.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const targetUid = selectedUser?.uid;
      if (dialogMode === 'edit' && !targetUid) {
        throw new Error('Usuário selecionado não encontrado.');
      }

      const headers = await getAuthHeaders();
      const payload: Record<string, string> = {
        displayName: values.displayName,
        email: values.email,
        role: values.role,
        photoURL: values.photoURL?.trim() ?? '',
      };

      if (dialogMode === 'create') {
        payload.password = values.password ?? '';
      } else if (values.password) {
        payload.password = values.password;
      }

      const endpoint =
        dialogMode === 'create'
          ? '/api/admin/users'
          : `/api/admin/users/${targetUid}`;

      const response = await fetch(endpoint, {
        method: dialogMode === 'create' ? 'POST' : 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Não foi possível salvar o usuário.');
      }

      toast({
        title: dialogMode === 'create' ? 'Usuário criado!' : 'Usuário atualizado!',
      });
      closeDialog();
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar usuário',
        description: error.message || 'Tente novamente em instantes.',
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/admin/users/${userToDelete.uid}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Não foi possível excluir o usuário.');
      }
      toast({ title: 'Usuário excluído com sucesso!' });
      setUserToDelete(null);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir usuário',
        description: error.message || 'Tente novamente em instantes.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (usersLoading) {
     return <div className="text-center p-8">Carregando usuários...</div>;
  }
  
  return (
    <Card className="bg-card/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Crie, edite ou remova usuários do sistema.</CardDescription>
            </div>
            <Button onClick={openCreateDialog} className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
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
                                <TableCell className="flex gap-2 justify-end">
                                  <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </Button>
                                  <Button variant="destructive" size="sm" onClick={() => setUserToDelete(user)}>
                                    <Trash className="mr-2 h-4 w-4" />
                                    Remover
                                  </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
        <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{dialogMode === 'create' ? 'Adicionar Usuário' : 'Editar Usuário'}</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para {dialogMode === 'create' ? 'criar um novo usuário' : 'atualizar o usuário selecionado'}.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
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
                        <Input type="email" placeholder="email@dominio.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cargo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="shelterAdmin">Admin (Abrigo)</SelectItem>
                          <SelectItem value="operator">Operador</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormDescription>
                        {dialogMode === 'create'
                          ? 'Defina a senha inicial do usuário.'
                          : 'Preencha apenas se desejar alterar a senha.'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!userToDelete} onOpenChange={(open) => (!open ? setUserToDelete(null) : null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação é irreversível. O usuário perderá o acesso imediatamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteUser} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isDeleting ? 'Removendo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                <TabsTrigger value="applications" className="justify-start text-lg p-3 data-[state=active]:bg-accent data-[state=active]:shadow-none">
                  <Inbox className="mr-2 h-5 w-5" />
                  Pedidos
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
              <TabsContent value="applications">
                  {appUser && <ApplicationsTab appUser={appUser} />}
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
