import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminServices } from '@/lib/firebase-admin';
import { ApiError, requireOperator } from '@/lib/server/require-operator';

const updateUserSchema = z.object({
  displayName: z.string().min(3, 'Nome precisa de pelo menos 3 caracteres.'),
  email: z.string().email('Informe um email válido.'),
  role: z.enum(['user', 'shelterAdmin', 'operator']),
  photoURL: z
    .string()
    .url('Informe uma URL válida.')
    .or(z.literal(''))
    .optional(),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres.')
    .optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    await requireOperator(req);
    const body = await req.json();
    const payload = updateUserSchema.parse(body);

    const { auth, db } = getAdminServices();

    const authUpdates: Parameters<typeof auth.updateUser>[1] = {
      displayName: payload.displayName,
      email: payload.email,
      photoURL: payload.photoURL?.trim()
        ? payload.photoURL.trim()
        : undefined,
    };

    if (payload.password) {
      authUpdates.password = payload.password;
    }

    await auth.updateUser(params.uid, authUpdates);

    await db
      .collection('users')
      .doc(params.uid)
      .set(
        {
          displayName: payload.displayName,
          email: payload.email,
          role: payload.role,
          photoURL: payload.photoURL?.trim() || null,
        },
        { merge: true }
      );

    return NextResponse.json({ uid: params.uid });
  } catch (error: any) {
    return NextResponse.json(
      { message: extractErrorMessage(error) },
      { status: resolveStatus(error) }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    await requireOperator(req);
    const { auth, db } = getAdminServices();

    await auth.deleteUser(params.uid);
    await db.collection('users').doc(params.uid).delete();

    return NextResponse.json({ uid: params.uid });
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
