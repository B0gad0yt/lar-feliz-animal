import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminServices } from '@/lib/firebase-admin';
import { requireOperator, ApiError } from '@/lib/server/require-operator';

const createUserSchema = z.object({
  displayName: z.string().min(3, 'Nome precisa de pelo menos 3 caracteres.'),
  email: z.string().email('Informe um email válido.'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
  role: z.enum(['user', 'shelterAdmin', 'operator']),
  photoURL: z
    .string()
    .url('Informe uma URL válida.')
    .or(z.literal(''))
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireOperator(req);

    const body = await req.json();
    const payload = createUserSchema.parse(body);

    const { auth, db } = getAdminServices();

    const userRecord = await auth.createUser({
      email: payload.email,
      password: payload.password,
      displayName: payload.displayName,
      photoURL: payload.photoURL?.trim() ? payload.photoURL.trim() : undefined,
    });

    await db
      .collection('users')
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        email: payload.email,
        displayName: payload.displayName,
        photoURL: payload.photoURL?.trim() || null,
        role: payload.role,
      });

    return NextResponse.json(
      { uid: userRecord.uid },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: extractErrorMessage(error) },
      { status: resolveStatus(error) }
    );
  }
}

function resolveStatus(error: unknown) {
  if (error instanceof ApiError) return error.status;
  if (error instanceof z.ZodError) return 400;
  return 500;
}

function extractErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof z.ZodError) return error.errors[0]?.message ?? 'Dados inválidos.';
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro inesperado.';
}
