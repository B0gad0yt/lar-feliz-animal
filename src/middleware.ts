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

  // NOTE: Não use `firebase/auth` (SDK do cliente) dentro do middleware do
  // Next.js — o middleware roda em um runtime diferente (edge) e não tem
  // acesso ao estado do cliente. A tentativa anterior de chamar `getAuth()`
  // e `auth.currentUser` causava comportamento incorreto (usuários eram
  // redirecionados para /login mesmo estando autenticados). Para uma verificação
  // segura no middleware é necessário validar um cookie assinado/jwt no servidor
  // (por exemplo usando Firebase Admin), ou implementar guards no cliente.
  //
  // Para não bloquear o fluxo do usuário enquanto uma solução server-side
  // segura é implementada, apenas permitimos a requisição seguir adiante.
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