import { NextResponse } from 'next/server';
import { createChallenge } from 'altcha-lib';

export const runtime = 'nodejs';

export async function GET() {
  const hmacKey = process.env.ALTCHA_HMAC_KEY || process.env.ALTCHA_SECRET_KEY;

  if (!hmacKey) {
    return NextResponse.json({ message: 'ALTCHA_HMAC_KEY não configurada.' }, { status: 500 });
  }

  try {
    const challenge = await createChallenge({
      hmacKey,
      expires: new Date(Date.now() + 5 * 60 * 1000),
      params: { scope: 'adoption-form' },
    });

    return NextResponse.json(challenge);
  } catch (error: any) {
    console.error('Erro ao gerar desafio ALTCHA', error);
    return NextResponse.json({ message: error?.message || 'Erro ao gerar desafio.' }, { status: 500 });
  }
}
