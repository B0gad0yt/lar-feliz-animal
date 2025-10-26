import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || process.env.HCAPTCHA_SITEKEY;

  if (!siteKey) {
    return NextResponse.json({ message: 'HCAPTCHA_SITEKEY não configurado.' }, { status: 404 });
  }

  return NextResponse.json({ siteKey });
}
