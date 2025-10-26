import { NextRequest, NextResponse } from 'next/server';
import { verifySolution } from 'altcha-lib';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const hmacKey = process.env.ALTCHA_HMAC_KEY || process.env.ALTCHA_SECRET_KEY;

  if (!hmacKey) {
    return NextResponse.json({ message: 'ALTCHA_HMAC_KEY não configurada.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const payload = body?.payload || body?.token;

    if (!payload) {
      return NextResponse.json({ message: 'Payload ausente.' }, { status: 400 });
    }

    const verified = await verifySolution(payload, hmacKey);

    if (!verified) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    return NextResponse.json({ verified: true, payload });
  } catch (error: any) {
    console.error('Erro ao validar ALTCHA', error);
    return NextResponse.json({ message: error?.message || 'Erro ao validar ALTCHA.' }, { status: 500 });
  }
}
