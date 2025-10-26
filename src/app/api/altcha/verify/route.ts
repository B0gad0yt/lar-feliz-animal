import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json({ message: 'ALTCHA integration removed. Use hCaptcha instead.' }, { status: 410 });
}
