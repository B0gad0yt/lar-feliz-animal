import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (isPublicRoute) return NextResponse.next();

  // Rotas protegidas simples; ideal: validar ID token Firebase via Admin SDK.
  const protectedRoutes = ['/favorites', '/matcher'];
  const needsAuth = protectedRoutes.some(route => pathname.startsWith(route));

  if (needsAuth) {
    // Heurística: se não houver cookie de sessão/id token, redireciona.
    const hasAuthCookie = request.cookies.has('firebaseAuthToken') || request.cookies.has('__session');
    if (!hasAuthCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callback', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
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