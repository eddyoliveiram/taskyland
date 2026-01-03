# Configuração do Supabase - Passo a Passo

## 1. Configurar Google OAuth no Supabase

### 1.1 Acesse o Console do Supabase
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Acesse seu projeto: **dtegxxlkbedxosnelgaj**

### 1.2 Configurar Google OAuth
1. No menu lateral, vá em **Authentication** → **Providers**
2. Encontre **Google** na lista de providers
3. Clique em **Enable** (Habilitar)
4. Você verá um **Callback URL**, algo como:
   ```
   https://dtegxxlkbedxosnelgaj.supabase.co/auth/v1/callback
   ```
   **Copie esta URL** - você vai precisar dela no próximo passo

### 1.3 Criar Projeto no Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou use um existente
3. No menu lateral, vá em **APIs e Serviços** → **Tela de consentimento OAuth**
4. Configure a tela de consentimento:
   - Tipo de usuário: **Externo**
   - Nome do app: **To-Do List App** (ou o nome que preferir)
   - Email de suporte: seu email
   - Domínio da página inicial: `https://seu-dominio.vercel.app` (após deploy)
   - Escopos: deixe os padrões
   - Adicione seu email como usuário de teste

### 1.4 Criar Credenciais OAuth
1. Vá em **APIs e Serviços** → **Credenciais**
2. Clique em **Criar Credenciais** → **ID do cliente OAuth 2.0**
3. Tipo de aplicativo: **Aplicativo da Web**
4. Nome: **To-Do List Web Client**
5. **Origens JavaScript autorizadas:**
   ```
   https://dtegxxlkbedxosnelgaj.supabase.co
   http://localhost:5173
   https://seu-dominio.vercel.app
   ```
6. **URIs de redirecionamento autorizados:**
   ```
   https://dtegxxlkbedxosnelgaj.supabase.co/auth/v1/callback
   http://localhost:5173
   https://seu-dominio.vercel.app
   ```
7. Clique em **Criar**
8. **Copie o Client ID e Client Secret**

### 1.5 Adicionar Credenciais ao Supabase
1. Volte ao Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Cole o **Client ID** no campo **Client ID (for OAuth)**
3. Cole o **Client Secret** no campo **Client Secret (for OAuth)**
4. Clique em **Save**

## 2. Criar Tabelas no Banco de Dados

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `database-schema.sql` que está na raiz do projeto
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Verifique se não houve erros

Isso criará:
- Tabela `profiles` (perfis de usuários)
- Tabela `tasks` (tarefas)
- Políticas de segurança (RLS)
- Triggers automáticos
- Índices para performance

## 3. Verificar a Configuração

### 3.1 Verificar Tabelas
1. Vá em **Table Editor** no Supabase
2. Você deve ver as tabelas:
   - `profiles`
   - `tasks`

### 3.2 Verificar Row Level Security (RLS)
1. Clique em cada tabela
2. Vá na aba **Policies**
3. Verifique se as políticas foram criadas:
   - Para `profiles`: políticas de view e update
   - Para `tasks`: políticas de select, insert, update e delete

## 4. Testar Localmente

1. Certifique-se de que o arquivo `.env` existe com as credenciais:
   ```
   VITE_SUPABASE_URL=https://dtegxxlkbedxosnelgaj.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. Execute o projeto:
   ```bash
   npm run dev
   ```

3. Acesse `http://localhost:5173`

4. Teste o login com Google:
   - Clique em "Continuar com Google"
   - Faça login com sua conta Google
   - Você deve ser redirecionado de volta ao app

5. Teste criar uma tarefa:
   - Clique em "Nova Tarefa"
   - Preencha os dados
   - Salve
   - Verifique no Supabase → **Table Editor** → **tasks** se a tarefa foi criada

## 5. Preparar para Deploy na Vercel

### 5.1 Criar repositório Git (se ainda não existe)
```bash
git init
git add .
git commit -m "Initial commit with Supabase integration"
```

### 5.2 Criar repositório no GitHub
1. Vá em [GitHub](https://github.com) e crie um novo repositório
2. Conecte seu repositório local:
```bash
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git branch -M main
git push -u origin main
```

### 5.3 Deploy na Vercel
1. Acesse [Vercel](https://vercel.com)
2. Clique em **Add New** → **Project**
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: `https://dtegxxlkbedxosnelgaj.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
5. Clique em **Deploy**

### 5.4 Atualizar Google OAuth com URL da Vercel
1. Após o deploy, copie a URL do seu app na Vercel (ex: `https://seu-app.vercel.app`)
2. Volte ao Google Cloud Console → **Credenciais**
3. Edite o **ID do cliente OAuth** criado anteriormente
4. Adicione a URL da Vercel em:
   - **Origens JavaScript autorizadas**: `https://seu-app.vercel.app`
   - **URIs de redirecionamento autorizados**: `https://seu-app.vercel.app`
5. Salve

## 6. Solução de Problemas

### Erro: "User already registered"
- O usuário já existe no sistema
- Tente fazer login normalmente

### Erro: "Invalid login credentials"
- Verifique se o Google OAuth está configurado corretamente
- Verifique se as URLs de redirect estão corretas

### Tarefas não aparecem
- Verifique se o RLS está habilitado
- Verifique se as políticas de segurança foram criadas corretamente
- Abra o console do navegador (F12) e veja se há erros

### Erro de CORS
- Verifique se as URLs estão corretas no Google Cloud Console
- Verifique se adicionou todas as origens necessárias

## 7. Estrutura do Banco de Dados

### Tabela: profiles
- `id` (uuid): ID do usuário (referência ao auth.users)
- `email` (text): Email do usuário
- `full_name` (text): Nome completo
- `avatar_url` (text): URL do avatar do Google
- `created_at` (timestamp): Data de criação
- `updated_at` (timestamp): Data de atualização

### Tabela: tasks
- `id` (uuid): ID único da tarefa
- `user_id` (uuid): ID do usuário dono da tarefa
- `title` (text): Título da tarefa
- `description` (text): Descrição
- `completed` (boolean): Se está concluída
- `priority` (text): Prioridade (low, medium, high)
- `due_date` (timestamp): Data de vencimento
- `completed_at` (timestamp): Data de conclusão
- `created_at` (timestamp): Data de criação
- `updated_at` (timestamp): Data de atualização
- `category` (text): Categoria
- `tags` (text[]): Array de tags

## Pronto! 🎉

Seu aplicativo agora está:
- ✅ Integrado com Supabase
- ✅ Autenticação com Google OAuth
- ✅ Banco de dados PostgreSQL
- ✅ Dados isolados por usuário
- ✅ Sincronização em tempo real
- ✅ Deploy na Vercel
