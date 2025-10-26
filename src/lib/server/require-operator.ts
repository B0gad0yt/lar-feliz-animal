'use server';

import { type NextRequest } from 'next/server';
import { getAdminServices } from '@/lib/firebase-admin';
import type { User as AppUser } from '@/lib/types';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function requireOperator(req: NextRequest): Promise<AppUser> {
  const authHeader = req.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Token de autenticação ausente.');
  }

  const token = authHeader.split(' ')[1];

  const { auth, db } = getAdminServices();

  try {
    const decoded = await auth.verifyIdToken(token);
    const userSnap = await db.collection('users').doc(decoded.uid).get();

    if (!userSnap.exists) {
      throw new ApiError(403, 'Perfil de usuário não encontrado.');
    }

    const operator = userSnap.data() as AppUser;

    if (operator.role !== 'operator') {
      throw new ApiError(403, 'Apenas operadores podem executar esta ação.');
    }

    return operator;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Token inválido ou expirado.');
  }
}
