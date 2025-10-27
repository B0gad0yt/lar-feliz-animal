# Lar Feliz Animal 🐾

Uma plataforma moderna e completa para conectar pessoas com animais disponíveis para adoção. Desenvolvida com Next.js 15, Firebase e Tailwind CSS.

## ✨ Principais Funcionalidades

### 🏠 Para Adotantes
- **Navegação de Perfis**: Explore perfis detalhados com fotos, histórias e personalidades de cada animal
- **Sistema de Favoritos**: Salve seus animais favoritos para visualizar depois
- **Busca Avançada**: Filtre por espécie, tamanho, idade, sexo e mais
- **Match Inteligente**: Encontre pets compatíveis com seu estilo de vida usando filtros de temperamento
- **Compartilhamento Social**: Compartilhe perfis de animais nas redes sociais
- **Formulário de Adoção**: Processo simplificado com verificação hCaptcha

### 📚 Conteúdo Educativo
- **Guia Completo**: Informações sobre posse responsável e consequências do abandono
- **FAQ Detalhado**: Respostas para as perguntas mais frequentes
- **Estatísticas**: Dados sobre abandono animal no Brasil
- **Materiais para Compartilhar**: PDFs e recursos educativos

### 🏢 Para Abrigos/ONGs
- **Painel Administrativo**: Gerencie animais, abrigos e candidaturas
- **Sistema de Usuários**: Controle de acesso com diferentes níveis (operator, shelterAdmin)
- **Notificações**: Acompanhe novas candidaturas em tempo real

### 🚀 Recursos Técnicos
- **PWA (Progressive Web App)**: Instalável em dispositivos móveis
- **SEO Otimizado**: Meta tags, Open Graph, sitemap dinâmico
- **Google Analytics**: Rastreamento de métricas e comportamento
- **Acessibilidade**: ARIA labels, navegação por teclado, contraste otimizado
- **Responsivo**: Design adaptável para todos os dispositivos
- **Dark Mode**: Tema claro/escuro automático

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 15](https://nextjs.org/) com App Router
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Autenticação**: [Firebase Auth](https://firebase.google.com/products/auth)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Formulários**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Validação Humana**: [hCaptcha](https://www.hcaptcha.com/)
- **Analytics**: [Google Analytics 4](https://analytics.google.com/)

## 🎨 Design System

- **Cor Primária**: Soft Lilac (#D0B4DE) - calma e cuidado
- **Background**: Very Light Lilac (#F7F2FA) - quase branco com toque lilás
- **Acento**: Aquamarine (#B4DEDE) - contraste visível
- **Fonte**: 'Alegreya' - serif elegante e contemporânea
- **Estilo**: Liquid glass effect com elementos translúcidos inspirados no iOS

## 🚀 Como Começar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Firebase (com Firestore habilitado)
- Conta hCaptcha (opcional, para formulários)
- Conta Google Analytics (opcional, para analytics)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/lar-feliz-animal.git
cd lar-feliz-animal
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Firebase, hCaptcha e Google Analytics.

4. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:9002](http://localhost:9002) no navegador.

## 📦 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento (porta 9002)
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa o linter
npm run typecheck    # Verifica tipos TypeScript
```

## 🔐 Configuração do Firebase

### Firestore Collections

O projeto usa as seguintes collections:

- **animals**: Perfis de animais para adoção
- **shelters**: Informações dos abrigos/ONGs
- **users**: Dados dos usuários
- **adoptionApplications**: Formulários de adoção
- **config**: Configurações do site

### Service Account

Para usar as rotas administrativas (`/api/admin/users`), configure um Service Account:

1. Acesse o Console do Firebase
2. Vá em **Project Settings** > **Service Accounts**
3. Clique em **Generate New Private Key**
4. Adicione as credenciais ao `.env.local`:

```
FIREBASE_ADMIN_PROJECT_ID=seu-projeto
FIREBASE_ADMIN_CLIENT_EMAIL=service-account@seu-projeto.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n... \n-----END PRIVATE KEY-----\n"
```

## 🔒 Segurança e Regras do Firestore

As regras do Firestore estão em `firestore.rules`. Principais permissões:

- **Leitura pública**: animals, shelters
- **Escrita autenticada**: adoptionApplications
- **Admin apenas**: users (CRUD completo requer role 'operator')

## 🌐 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático!

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Railway
- Netlify
- AWS Amplify
- Google Cloud Run

## 📱 PWA - Progressive Web App

O site pode ser instalado como aplicativo em dispositivos móveis:

1. Acesse o site pelo navegador mobile
2. Clique em "Adicionar à tela inicial"
3. Use como app nativo!

Ícones PWA devem ser colocados em `/public/icons/` nos tamanhos especificados no `manifest.json`.

## 🧪 Testes

(Em desenvolvimento)

```bash
npm run test         # Executa testes
npm run test:watch   # Modo watch
npm run test:coverage # Cobertura de testes
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

- **Email**: contato@larfelizanimal.com
- **Website**: [https://larfelizanimal.com](https://larfelizanimal.com)

## 🙏 Agradecimentos

- Aos abrigos e ONGs que salvam vidas todos os dias
- À comunidade open source do React/Next.js
- A todos que adotam ao invés de comprar

---

Feito com ❤️ para nossos amigos de quatro patas 🐾

