import { NextRequest, NextResponse } from 'next/server';

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const apiKey = process.env.RECAPTCHA_ENTERPRISE_API_KEY;
const location = process.env.RECAPTCHA_ENTERPRISE_LOCATION || 'global';

export async function POST(req: NextRequest) {
  try {
    if (!projectId || !siteKey || !apiKey) {
      return NextResponse.json(
        { message: 'Configuração do reCAPTCHA ausente.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { token, action } = body;

    if (!token || !action) {
      return NextResponse.json(
        { message: 'Token ou ação não fornecidos.' },
        { status: 400 }
      );
    }

    const verifyResponse = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/locations/${location}/assessments?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: {
            token,
            siteKey,
            expectedAction: action,
          },
        }),
      }
    );

    const response = await verifyResponse.json();

    if (!verifyResponse.ok) {
      const message = response?.error?.message || 'Erro ao verificar o reCAPTCHA.';
      return NextResponse.json({ message }, { status: 500 });
    }

    if (!response.tokenProperties?.valid) {
      return NextResponse.json(
        { message: `Token inválido: ${response.tokenProperties?.invalidReason ?? 'desconhecido'}` },
        { status: 400 }
      );
    }

    if (response.tokenProperties?.action !== action) {
      return NextResponse.json(
        { message: 'Ação do reCAPTCHA não corresponde.' },
        { status: 400 }
      );
    }

    const score = response.riskAnalysis?.score ?? 0;

    return NextResponse.json({
      score,
      reasons: response.riskAnalysis?.reasons ?? [],
    });
  } catch (error: any) {
    console.error('Erro ao validar reCAPTCHA', error);
    return NextResponse.json(
      { message: error?.message || 'Erro ao validar o reCAPTCHA.' },
      { status: 500 }
    );
  }
}
