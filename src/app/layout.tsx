import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { initializeFirebase } from '@/firebase';
import { getDoc, doc } from 'firebase/firestore';
import type { SiteConfig } from '@/lib/types';


// This function now dynamically generates metadata
export async function generateMetadata(): Promise<Metadata> {
  // Initialize server-side firebase to fetch config
  const { firestore } = initializeFirebase();
  const configRef = doc(firestore, 'config', 'site');
  
  try {
    const configSnap = await getDoc(configRef);

    if (configSnap.exists()) {
      const siteConfig = configSnap.data() as SiteConfig;
      return {
        title: siteConfig.title || 'Lar Feliz Animal',
        description: 'Encontre seu amigo para sempre.',
      };
    }
  } catch (error) {
    console.error("Failed to fetch site config for metadata", error);
  }

  // Fallback metadata
  return {
    title: 'Lar Feliz Animal',
    description: 'Encontre seu amigo para sempre.',
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
