import { shelters } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Phone, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

export default function SheltersPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Nossos Abrigos Parceiros</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Conheça as organizações incríveis que cuidam dos nossos anjinhos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {shelters.map((shelter) => (
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
                <a href={`mailto:${shelter.email}`} className="hover:underline text-primary">
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
    </div>
  );
}
