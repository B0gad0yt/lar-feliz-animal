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

const protectedRoutes = ['/favorites', '/matcher', '/profile', '/admin'];

const textDecoder = new TextDecoder();
const expectedProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

function decodeJwtPayload(token: string): Record<string, any> | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const json = textDecoder.decode(bytes);
    return JSON.parse(json) as Record<string, any>;
  } catch (error) {
    console.error('Falha ao decodificar token JWT', error);
    return null;
  }
}

function isSessionCookieValid(token: string | undefined): boolean {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= now) {
    return false;
  }

  if (expectedProjectId) {
    const audienceOk = payload.aud === expectedProjectId;
    const issuerOk = typeof payload.iss === 'string' && payload.iss.includes(expectedProjectId);
    if (!audienceOk && !issuerOk) {
      return false;
    }
  }

  return true;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (isPublicRoute) return NextResponse.next();

  const needsAuth = protectedRoutes.some(route => pathname.startsWith(route));

  if (needsAuth) {
    const sessionToken = request.cookies.get('__session')?.value;

    if (!isSessionCookieValid(sessionToken)) {
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