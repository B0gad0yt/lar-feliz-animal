import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminServices } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

const SESSION_COOKIE_NAME = '__session';
const DEFAULT_MAX_AGE = 60 * 60; // 1 hour fallback

async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body?.token as string | undefined;

    if (!token) {
      return NextResponse.json({ message: 'Token ausente.' }, { status: 400 });
    }

    const { auth } = getAdminServices();
    const decoded = await auth.verifyIdToken(token);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const expiresInSeconds = Math.max(
      0,
      typeof decoded.exp === 'number' ? decoded.exp - nowInSeconds : DEFAULT_MAX_AGE,
    );

    const cookieStore = await cookies();
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: expiresInSeconds || DEFAULT_MAX_AGE,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Erro ao criar cookie de sessão Firebase', error);
    await clearSessionCookie();
    return NextResponse.json({ message: 'Não foi possível validar o token.' }, { status: 401 });
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
