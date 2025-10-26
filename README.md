# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Firebase Admin (CRUD de Usuários)

As rotas `/api/admin/users` exigem um Service Account para operar ações administrativas (criar, editar, excluir usuários).  
Defina as variáveis a seguir em um arquivo `.env.local` ou no provedor de hospedagem:

```
FIREBASE_ADMIN_PROJECT_ID=seu-projeto
FIREBASE_ADMIN_CLIENT_EMAIL=service-account@seu-projeto.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n... \n-----END PRIVATE KEY-----\n"
```

> Observação: se estiver usando um arquivo `.env`, mantenha as quebras de linha escapadas (`\n`). Em ambientes gerenciados (Vercel, Railway, etc.), cole a chave completa e substitua novas linhas por `\n`.

Somente usuários autenticados com papel `operator` conseguem obter um ID token válido para chamar essas rotas.

## Verificação humana no formulário de adoção

O formulário usa o [ALTCHA](https://altcha.org) como desafio padrão. Configure uma chave HMAC para assinar os desafios:

```
ALTCHA_HMAC_KEY=uma-chave-secreta-bem-grande
```

O widget consome os endpoints `/api/altcha/challenge` e `/api/altcha/verify`. O Firestore mantém o campo `altchaPayload` em cada pedido de adoção como registro da verificação.
