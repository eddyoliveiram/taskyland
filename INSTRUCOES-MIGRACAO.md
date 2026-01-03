# 📋 Instruções para Migração do Banco de Dados

## ✅ Passo a Passo

### 1. Acesse o Supabase
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Acesse seu projeto: **dtegxxlkbedxosnelgaj**
3. No menu lateral, clique em **SQL Editor**

### 2. Execute o Script de Migração
1. Clique em **New Query**
2. Copie TODO o conteúdo do arquivo `database-migration-family.sql`
3. Cole no editor SQL
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Aguarde a execução (deve levar poucos segundos)

### 3. Verifique se Funcionou
Após executar o script, vá em **Table Editor** e verifique:

#### Tabela: `family_members` (NOVA)
- ✅ Deve aparecer na lista de tabelas
- ✅ Colunas: id, manager_id, name, avatar_url, color, created_at, updated_at

#### Tabela: `tasks` (MODIFICADA)
- ✅ Deve ter uma nova coluna: `member_id`
- ⚠️ A coluna `user_id` ainda existe (não foi removida por segurança)

### 4. Verifique as Políticas (RLS)
1. Clique na tabela `family_members`
2. Vá na aba **Policies**
3. Você deve ver 4 políticas:
   - ✅ Managers can view own family members
   - ✅ Managers can create family members
   - ✅ Managers can update own family members
   - ✅ Managers can delete own family members

4. Clique na tabela `tasks`
5. Vá na aba **Policies**
6. Você deve ver 4 políticas (NOVAS):
   - ✅ Managers can view family tasks
   - ✅ Managers can create family tasks
   - ✅ Managers can update family tasks
   - ✅ Managers can delete family tasks

## 🎯 O que mudou?

### Antes:
```
profiles (usuário Google)
    ↓
tasks (user_id → profiles.id)
```

### Depois:
```
profiles (gerente/usuário Google)
    ↓
family_members (manager_id → profiles.id)
    ↓
tasks (member_id → family_members.id)
```

## ⚠️ IMPORTANTE

### A coluna `user_id` NÃO foi removida!
- Por segurança, mantive a coluna `user_id` na tabela `tasks`
- Isso permite que você migre os dados gradualmente
- Quando tiver certeza que tudo está funcionando, você pode executar:

```sql
-- APENAS execute isso quando tiver 100% de certeza!
ALTER TABLE public.tasks DROP COLUMN user_id;
```

### Se você já tem tarefas cadastradas:
Execute este SQL para migrar os dados:

```sql
-- 1. Criar um membro para cada usuário existente
INSERT INTO public.family_members (manager_id, name, avatar_url, color)
SELECT
  id,
  COALESCE(full_name, email),
  avatar_url,
  '#3b82f6'
FROM public.profiles
WHERE NOT EXISTS (
  SELECT 1 FROM public.family_members WHERE manager_id = profiles.id
);

-- 2. Atualizar member_id nas tarefas existentes
UPDATE public.tasks
SET member_id = (
  SELECT fm.id
  FROM public.family_members fm
  WHERE fm.manager_id = tasks.user_id
  LIMIT 1
)
WHERE member_id IS NULL AND user_id IS NOT NULL;
```

## 🚀 Próximos Passos

Agora que o banco está pronto, você precisa:

1. ✅ **SQL executado** ← Você está aqui!
2. ⏭️ Criar interface de seleção de membros
3. ⏭️ Criar componentes para adicionar/editar membros
4. ⏭️ Atualizar o código para usar `member_id` ao invés de `user_id`
5. ⏭️ Testar criação de membros e tarefas

## 📞 Precisa de Ajuda?

Se algo der errado:
1. Verifique se há erros no console do SQL Editor
2. Verifique se as tabelas foram criadas em **Table Editor**
3. Verifique se as políticas foram criadas em **Policies**

## 🎨 Estrutura Final

```
┌─────────────────────────────────────────┐
│  Login Google (profiles)                │
│  └─ gerente@gmail.com                   │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Membros da Família (family_members)    │
│  ├─ João (Pai)      [#3b82f6]           │
│  ├─ Maria (Mãe)     [#ef4444]           │
│  └─ Pedro (Filho)   [#10b981]           │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Tarefas (tasks)                        │
│  João:  [X] Fazer compras               │
│  João:  [ ] Levar carro na oficina      │
│  Maria: [X] Reunião às 14h              │
│  Pedro: [ ] Estudar para prova          │
└─────────────────────────────────────────┘
```

✅ **Pronto para executar o SQL!**
