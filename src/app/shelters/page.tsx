'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Phone, Mail, Globe } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Shelter } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function SheltersPage() {
  const firestore = useFirestore();
  const sheltersQuery = useMemo(() => firestore ? collection(firestore, 'shelters') : null, [firestore]);
  const { data: shelters, loading } = useCollection<Shelter>(sheltersQuery);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="bg-card/70 backdrop-blur-sm border-0 shadow-lg flex flex-col">
          <CardHeader>
            <Skeleton className="h-7 w-3/5" />
            <Skeleton className="h-4 w-4/5 mt-2" />
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-3 rounded-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
             <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-3 rounded-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Nossos Abrigos Parceiros</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Conheça as organizações incríveis que cuidam dos nossos anjinhos.
        </p>
      </header>
      
      {loading ? renderSkeleton() : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {shelters && shelters.map((shelter) => (
            <Card key={shelter.id} className="bg-card/70 backdrop-blur-sm border-0 shadow-lg flex flex-col">
                <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                    <Home className="mr-3 h-6 w-6 text-primary" />
                    {shelter.name}
                </CardTitle>
                <CardDescription>{shelter.address}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>{shelter.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                    <a href={`mailto:${shelter.email}`} className="hover:underline text-primary break-all">
                    {shelter.email}
                    </a>
                </div>
                </CardContent>
                <CardFooter>
                <Button asChild className="w-full">
                    <Link href={shelter.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Visitar Website
                    </Link>
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
}

    