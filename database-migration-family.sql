-- ===================================================================
-- MIGRAÇÃO: Sistema Multi-Usuário com Membros da Família
-- ===================================================================
-- O usuário do Google é o "gerente da conta" e pode adicionar membros
-- Cada membro tem suas próprias tarefas
-- ===================================================================

-- 1. Criar tabela de membros da família
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  manager_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  color TEXT DEFAULT '#3b82f6', -- Cor para identificação visual
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS family_members_manager_id_idx ON public.family_members(manager_id);

-- 3. Alterar tabela tasks para referenciar family_members ao invés de profiles
-- Primeiro, adicionar nova coluna
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE;

-- Criar índice para member_id
CREATE INDEX IF NOT EXISTS tasks_member_id_idx ON public.tasks(member_id);

-- 4. Remover políticas antigas de tasks
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;

-- 5. Criar novas políticas de segurança para family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Gerente pode ver seus próprios membros
CREATE POLICY "Managers can view own family members"
  ON public.family_members FOR SELECT
  USING (auth.uid() = manager_id);

-- Gerente pode criar membros
CREATE POLICY "Managers can create family members"
  ON public.family_members FOR INSERT
  WITH CHECK (auth.uid() = manager_id);

-- Gerente pode atualizar seus próprios membros
CREATE POLICY "Managers can update own family members"
  ON public.family_members FOR UPDATE
  USING (auth.uid() = manager_id);

-- Gerente pode deletar seus próprios membros
CREATE POLICY "Managers can delete own family members"
  ON public.family_members FOR DELETE
  USING (auth.uid() = manager_id);

-- 6. Criar novas políticas para tasks (baseadas em member_id)
-- Gerente pode ver tarefas de todos os seus membros
CREATE POLICY "Managers can view family tasks"
  ON public.tasks FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM public.family_members WHERE manager_id = auth.uid()
    )
  );

-- Gerente pode criar tarefas para seus membros
CREATE POLICY "Managers can create family tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM public.family_members WHERE manager_id = auth.uid()
    )
  );

-- Gerente pode atualizar tarefas de seus membros
CREATE POLICY "Managers can update family tasks"
  ON public.tasks FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM public.family_members WHERE manager_id = auth.uid()
    )
  );

-- Gerente pode deletar tarefas de seus membros
CREATE POLICY "Managers can delete family tasks"
  ON public.tasks FOR DELETE
  USING (
    member_id IN (
      SELECT id FROM public.family_members WHERE manager_id = auth.uid()
    )
  );

-- 7. Trigger para atualizar updated_at em family_members
DROP TRIGGER IF EXISTS on_family_member_updated ON public.family_members;
CREATE TRIGGER on_family_member_updated
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 8. Remover coluna user_id antiga da tabela tasks (CUIDADO: isso apaga dados!)
-- Descomente a linha abaixo APENAS se você tiver certeza
-- ALTER TABLE public.tasks DROP COLUMN IF EXISTS user_id;

-- ===================================================================
-- INSTRUÇÕES DE USO:
-- ===================================================================
-- 1. Execute este script no SQL Editor do Supabase
-- 2. A coluna user_id ainda existe em tasks (por segurança)
-- 3. Para remover user_id, descomente a última linha
-- 4. Agora você deve:
--    - Criar membros da família via interface
--    - As tarefas devem referenciar member_id ao invés de user_id
-- ===================================================================
