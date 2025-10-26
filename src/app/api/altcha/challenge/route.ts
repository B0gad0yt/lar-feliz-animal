import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ message: 'ALTCHA integration removed. Use hCaptcha instead.' }, { status: 410 });
}
