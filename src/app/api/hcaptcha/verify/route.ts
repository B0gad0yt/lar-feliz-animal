import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = process.env.HCAPTCHA_SECRET;

  if (!secret) {
    return NextResponse.json({ message: 'HCAPTCHA_SECRET não configurado.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const token = body?.token;

    if (!token) {
      return NextResponse.json({ message: 'Token ausente.' }, { status: 400 });
    }

    // Try to use the official `hcaptcha` package if it's installed; otherwise
    // fall back to the direct siteverify HTTP call.
    let data: any = null;
    try {
      const mod = await import('hcaptcha');
      if (mod && typeof mod.verify === 'function') {
        data = await mod.verify(secret, token);
      }
    } catch (e) {
      // ignore — fallback to HTTP below
    }

    if (!data) {
      const params = new URLSearchParams();
      params.append('secret', secret);
      params.append('response', token);

      const res = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      data = await res.json();
    }

    if (!data || data.success !== true) {
      return NextResponse.json({ success: false, data }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Erro ao validar hCaptcha', error);
    return NextResponse.json({ message: error?.message || 'Erro ao validar hCaptcha.' }, { status: 500 });
  }
}
