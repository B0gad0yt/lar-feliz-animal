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

O formulário usa o hCaptcha como desafio. Configure as chaves do hCaptcha em um arquivo `.env.local` ou no provedor de hospedagem:

```
NEXT_PUBLIC_HCAPTCHA_SITEKEY=seu-sitekey-publico
# (opcional) caso prefira não embutir a chave pública durante o build,
# defina apenas esta variável que será exposta via endpoint em runtime
HCAPTCHA_SITEKEY=seu-sitekey-publico
HCAPTCHA_SECRET=sua-chave-secreta-do-hcaptcha
```

O widget carrega o script oficial do hCaptcha e, quando a chave pública não estiver embutida no bundle, o endpoint `/api/hcaptcha/sitekey` a fornece em tempo de execução. Já o endpoint server-side `/api/hcaptcha/verify` valida o token junto ao serviço do hCaptcha antes de salvar o pedido no Firestore.
