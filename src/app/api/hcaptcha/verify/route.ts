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

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json({ success: false, data }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Erro ao validar hCaptcha', error);
    return NextResponse.json({ message: error?.message || 'Erro ao validar hCaptcha.' }, { status: 500 });
  }
}
