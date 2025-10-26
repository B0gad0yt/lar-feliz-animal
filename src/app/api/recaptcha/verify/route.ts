import { NextRequest, NextResponse } from 'next/server';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

let recaptchaClient: RecaptchaEnterpriseServiceClient | null = null;

function getClient() {
  if (recaptchaClient) return recaptchaClient;

  if (!projectId || !clientEmail || !rawPrivateKey) {
    return null;
  }

  recaptchaClient = new RecaptchaEnterpriseServiceClient({
    credentials: {
      client_email: clientEmail,
      private_key: rawPrivateKey.replace(/\\n/g, '\n'),
    },
    projectId,
  });

  return recaptchaClient;
}

export async function POST(req: NextRequest) {
  try {
    if (!projectId || !siteKey) {
      return NextResponse.json(
        { message: 'Configuração do reCAPTCHA ausente.' },
        { status: 500 }
      );
    }

    const client = getClient();
    if (!client) {
      return NextResponse.json(
        { message: 'Credenciais do reCAPTCHA não configuradas.' },
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

    const [response] = await client.createAssessment({
      parent: client.projectPath(projectId),
      assessment: {
        event: {
          token,
          siteKey,
        },
      },
    });

    if (!response.tokenProperties?.valid) {
      return NextResponse.json(
        { message: `Token inválido: ${response.tokenProperties?.invalidReason ?? 'desconhecido'}` },
        { status: 400 }
      );
    }

    if (response.tokenProperties.action !== action) {
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
