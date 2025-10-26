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

## reCAPTCHA Enterprise

O formulário de adoção usa o reCAPTCHA Enterprise para evitar spam. Configure:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=sua-chave-publica
RECAPTCHA_ENTERPRISE_SITE_KEY=sua-chave-publica   # opcional no backend (ajuda a trocar sem rebuild)
FIREBASE_ADMIN_PROJECT_ID=seu-projeto-gcp
FIREBASE_ADMIN_CLIENT_EMAIL=service-account@seu-projeto.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

No Google Cloud Console habilite o reCAPTCHA Enterprise, crie uma chave Web e autorize os domínios (produção + localhost). Use as mesmas credenciais (service account) já utilizadas pelo Firebase Admin: o backend consome a API `createAssessment` autenticando com a chave privada.
