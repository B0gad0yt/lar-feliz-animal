import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuth, type User } from 'firebase/auth';
import { cookies } from 'next/headers';

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/login',
  '/register',
  '/verify-email',
  '/api',
  '/_next',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  // Verifica se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    // Pegar o token do cookie
    const token = request.cookies.get('session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificar se o email está verificado
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && !user.emailVerified) {
      return NextResponse.redirect(new URL('/login?error=email-not-verified', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Erro no middleware:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configurar os caminhos que devem passar pelo middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api|_next|_static|favicon.ico|sitemap.xml).*)',
  ],
}