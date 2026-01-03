# Guia Rápido - Deploy e Configuração

## ✅ O que já está pronto

1. ✅ Aplicação React com Vite
2. ✅ Integração com Supabase
3. ✅ Autenticação com Google OAuth
4. ✅ Hook `useTasksDb` para sincronizar tarefas
5. ✅ Tela de login moderna
6. ✅ Proteção de rotas
7. ✅ Schema do banco de dados ([database-schema.sql](./database-schema.sql))
8. ✅ Build de produção funcionando

## 🚀 Próximos Passos

### 1. Executar SQL no Supabase (5 minutos)

1. Acesse: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Vá no seu projeto
3. Menu **SQL Editor** → **New Query**
4. Cole todo o conteúdo do arquivo `database-schema.sql`
5. Clique em **Run**
6. Verifique se não houve erros

### 2. Configurar Google OAuth (10 minutos)

#### No Supabase:
1. **Authentication** → **Providers** → **Google** → **Enable**
2. **Copie o Callback URL**: `https://dtegxxlkbedxosnelgaj.supabase.co/auth/v1/callback`

#### No Google Cloud Console:
1. Acesse: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Crie/selecione um projeto
3. **APIs e Serviços** → **Tela de consentimento OAuth**
   - Tipo: Externo
   - Nome: To-Do List App
   - Adicione seu email como usuário de teste
4. **Credenciais** → **Criar Credenciais** → **ID do cliente OAuth 2.0**
   - Tipo: Aplicativo da Web
   - **Origens autorizadas**:
     ```
     https://dtegxxlkbedxosnelgaj.supabase.co
     http://localhost:5173
     ```
   - **URIs de redirecionamento**:
     ```
     https://dtegxxlkbedxosnelgaj.supabase.co/auth/v1/callback
     http://localhost:5173
     ```
5. **Copie Client ID e Client Secret**

#### Volte ao Supabase:
1. **Authentication** → **Providers** → **Google**
2. Cole **Client ID** e **Client Secret**
3. **Save**

### 3. Testar Localmente (2 minutos)

```bash
npm run dev
```

Acesse `http://localhost:5173` e teste o login com Google!

### 4. Deploy na Vercel (5 minutos)

#### Criar repositório no GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/seu-repo.git
git branch -M main
git push -u origin main
```

#### Deploy:
1. Acesse [https://vercel.com](https://vercel.com)
2. **Add New** → **Project**
3. Importe seu repositório
4. **Environment Variables**:
   - `VITE_SUPABASE_URL`: `https://dtegxxlkbedxosnelgaj.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (sua chave)
5. **Deploy**!

### 5. Atualizar Google OAuth com URL da Vercel (3 minutos)

Depois do deploy, pegue a URL da Vercel (ex: `https://seu-app.vercel.app`) e adicione:

1. **Google Cloud Console** → **Credenciais** → edite o OAuth Client
2. Adicione em **Origens autorizadas**: `https://seu-app.vercel.app`
3. Adicione em **URIs de redirecionamento**: `https://seu-app.vercel.app`
4. **Salvar**

## 🎉 Pronto!

Seu app está no ar com:
- ✅ Autenticação Google
- ✅ Banco de dados PostgreSQL
- ✅ Sincronização em tempo real
- ✅ Dados isolados por usuário
- ✅ Deploy automático (Vercel)

## 📝 Detalhes Importantes

### Suas Credenciais Supabase:
- **URL**: https://dtegxxlkbedxosnelgaj.supabase.co
- **Anon Key**: Já está no arquivo `.env`

### Estrutura do Banco:
- **profiles**: Perfis dos usuários (criado automaticamente no login)
- **tasks**: Tarefas (cada usuário vê apenas as suas)

### Segurança:
- ✅ Row Level Security (RLS) ativado
- ✅ Políticas impedem acesso entre usuários
- ✅ Triggers automáticos para criação de perfis

## 🔧 Solução de Problemas

### "Erro ao fazer login"
- Verifique se Google OAuth está configurado corretamente
- Verifique se as URLs de redirect estão corretas no Google Cloud

### "Tarefas não aparecem"
- Abra o console do navegador (F12)
- Verifique se há erros
- Confirme que o SQL foi executado corretamente no Supabase

### "CORS error"
- Verifique se adicionou TODAS as URLs no Google Cloud Console

## 📚 Documentação Completa

Para mais detalhes, veja [SETUP-SUPABASE.md](./SETUP-SUPABASE.md)
