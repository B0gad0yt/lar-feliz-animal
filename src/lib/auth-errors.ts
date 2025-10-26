type FirebaseAuthLikeError = {
  code?: string;
  message?: string;
};

const errorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Este email já está cadastrado. Faça login ou tente recuperar sua senha.',
  'auth/invalid-credential': 'Email ou senha inválidos. Verifique os dados e tente novamente.',
  'auth/user-not-found': 'Não encontramos uma conta com este email.',
  'auth/wrong-password': 'Senha incorreta. Tente novamente ou redefina sua senha.',
  'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o suporte.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.',
  'auth/network-request-failed': 'Não foi possível se conectar. Verifique sua internet.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/popup-blocked': 'O navegador bloqueou o popup do Google. Habilite popups para continuar.',
  'auth/popup-closed-by-user': 'O popup do Google foi fechado antes da conclusão.',
};

export function getAuthErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado. Tente novamente.') {
  const maybeError = error as FirebaseAuthLikeError | undefined;
  const code = maybeError?.code;

  if (code && errorMessages[code]) {
    return errorMessages[code];
  }

  if (maybeError?.message) {
    return maybeError.message;
  }

  return fallback;
}
