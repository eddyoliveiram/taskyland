# Nova Estrutura - Sistema Multi-Usuário com Membros da Família

## 📋 Conceito

O sistema agora funciona da seguinte forma:

1. **Gerente da Conta** (Usuário do Google)
   - Faz login via Google OAuth
   - É o "dono" da conta
   - Pode adicionar/editar/deletar membros da família
   - Pode ver e gerenciar tarefas de todos os membros

2. **Membros da Família**
   - Criados pelo gerente da conta
   - Cada membro tem nome, avatar e cor de identificação
   - Cada membro tem suas próprias tarefas
   - O próprio gerente pode se cadastrar como membro

## 🗄️ Estrutura do Banco de Dados

### Tabela: `profiles`
- Mantém os dados do usuário do Google (gerente)
- `id`, `email`, `full_name`, `avatar_url`

### Tabela: `family_members` (NOVA)
- Armazena os membros da família
- `id` - UUID único do membro
- `manager_id` - Referência ao usuário do Google (profiles.id)
- `name` - Nome do membro
- `avatar_url` - Foto/avatar do membro
- `color` - Cor para identificação visual (ex: #3b82f6)

### Tabela: `tasks` (MODIFICADA)
- Agora referencia `member_id` ao invés de `user_id`
- `member_id` - Referência ao membro (family_members.id)
- Todas as tarefas pertencem a um membro específico

## 🔐 Segurança (RLS - Row Level Security)

### Políticas para `family_members`:
- Gerente só vê seus próprios membros
- Gerente só pode criar/editar/deletar seus próprios membros

### Políticas para `tasks`:
- Gerente só vê tarefas dos membros vinculados a ele
- Gerente só pode criar/editar/deletar tarefas dos seus membros

## 🎯 Fluxo da Aplicação

### 1. Login (Google OAuth)
```
┌─────────────────┐
│  Tela de Login  │
│  Google OAuth   │
└────────┬────────┘
         │
         ▼
    Autenticado
```

### 2. Seleção de Membro
```
┌──────────────────────────────────┐
│  Selecionar Membro da Família    │
│                                   │
│  [Avatar] João (Pai)              │
│  [Avatar] Maria (Mãe)             │
│  [Avatar] Pedro (Filho)           │
│                                   │
│  [+ Adicionar Membro]             │
│  [✏️ Gerenciar Membros]           │
│  [🚪 Sair]                        │
└──────────────────────────────────┘
```

### 3. Tarefas do Membro Selecionado
```
┌──────────────────────────────────┐
│  [← Voltar] [Avatar] João        │
│                                   │
│  Tarefas                          │
│  Dashboard                        │
│                                   │
│  (Tarefas específicas do João)   │
└──────────────────────────────────┘
```

## 📝 Passos para Implementação

### 1. Executar SQL no Supabase
```sql
-- Execute o arquivo database-migration-family.sql
-- no SQL Editor do Supabase
```

### 2. Criar Páginas/Componentes
- `MemberSelection.tsx` - Tela de seleção de membros
- `MemberModal.tsx` - Modal para adicionar/editar membro
- `MemberCard.tsx` - Card para exibir cada membro

### 3. Criar Hooks
- `useMembers.ts` - CRUD de membros da família
- `useSelectedMember.ts` - Gerenciar membro selecionado

### 4. Atualizar Hooks Existentes
- `useTasksDb.ts` - Usar `member_id` ao invés de `user_id`

### 5. Criar Context
- `MemberContext.tsx` - Gerenciar estado do membro selecionado globalmente

## 🎨 Sugestões de UI

### Cores para Membros
```javascript
const memberColors = [
  '#3b82f6', // Azul
  '#ef4444', // Vermelho
  '#10b981', // Verde
  '#f59e0b', // Amarelo
  '#8b5cf6', // Roxo
  '#ec4899', // Rosa
  '#06b6d4', // Ciano
  '#f97316', // Laranja
]
```

### Avatares
- Permitir upload de foto
- Usar iniciais do nome como fallback
- Aplicar cor de fundo do membro

## 🔄 Migração de Dados Existentes

Se você já tem tarefas na tabela `tasks` com `user_id`:

```sql
-- 1. Criar um membro "padrão" para cada usuário
INSERT INTO public.family_members (manager_id, name, avatar_url)
SELECT id, full_name, avatar_url
FROM public.profiles;

-- 2. Atualizar member_id das tarefas existentes
UPDATE public.tasks
SET member_id = (
  SELECT id FROM public.family_members
  WHERE manager_id = tasks.user_id
  LIMIT 1
)
WHERE member_id IS NULL;

-- 3. Depois disso, você pode remover a coluna user_id
ALTER TABLE public.tasks DROP COLUMN user_id;
```

## ✅ Checklist de Implementação

- [ ] Executar SQL de migração no Supabase
- [ ] Criar tipos TypeScript para FamilyMember
- [ ] Criar hook useMembers
- [ ] Criar MemberContext
- [ ] Criar página MemberSelection
- [ ] Criar componente MemberModal
- [ ] Atualizar useTasksDb para usar member_id
- [ ] Adicionar botão "Voltar" nas páginas de tarefas
- [ ] Testar criação/edição/exclusão de membros
- [ ] Testar isolamento de tarefas entre membros
