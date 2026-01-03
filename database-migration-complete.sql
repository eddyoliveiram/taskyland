-- ===================================================================
-- MIGRAÇÃO COMPLETA: Sistema Multi-Usuário com Membros da Família
-- ===================================================================
-- Este script é seguro para executar múltiplas vezes
-- Ele verifica o que já existe antes de criar
-- ===================================================================

-- PASSO 1: Limpar políticas antigas
-- ===================================================================
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Managers can view family tasks" ON public.tasks;
DROP POLICY IF EXISTS "Managers can create family tasks" ON public.tasks;
DROP POLICY IF EXISTS "Managers can update family tasks" ON public.tasks;
DROP POLICY IF EXISTS "Managers can delete family tasks" ON public.tasks;

-- Remover políticas de family_members se existirem
DROP POLICY IF EXISTS "Managers can view own family members" ON public.family_members;
DROP POLICY IF EXISTS "Managers can create family members" ON public.family_members;
DROP POLICY IF EXISTS "Managers can update own family members" ON public.family_members;
DROP POLICY IF EXISTS "Managers can delete own family members" ON public.family_members;

-- PASSO 2: Criar tabela family_members
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  manager_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PASSO 3: Criar índices
-- ===================================================================
CREATE INDEX IF NOT EXISTS family_members_manager_id_idx ON public.family_members(manager_id);
CREATE INDEX IF NOT EXISTS tasks_member_id_idx ON public.tasks(member_id);

-- PASSO 4: Adicionar coluna member_id na tabela tasks
-- ===================================================================
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE;

-- PASSO 5: Habilitar RLS na tabela family_members
-- ===================================================================
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- PASSO 6: Criar políticas para family_members
-- ===================================================================
CREATE POLICY "Managers can view own family members"
  ON public.family_members FOR SELECT
  USING (auth.uid() = manager_id);

CREATE POLICY "Managers can create family members"
  ON public.family_members FOR INSERT
  WITH CHECK (auth.uid() = manager_id);

CREATE POLICY "Managers can update own family members"
  ON public.family_members FOR UPDATE
  USING (auth.uid() = manager_id);

CREATE POLICY "Managers can delete own family members"
  ON public.family_members FOR DELETE
  USING (auth.uid() = manager_id);

-- PASSO 7: Criar políticas para tasks (baseadas em member_id)
-- ===================================================================
CREATE POLICY "Managers can view family tasks"
  ON public.tasks FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM public.family_members WHERE manager_id = auth.uid()
    )
  );

CREATE POLICY "Managers can create family tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM public.family_members WHERE manager_id = auth.uid()
    )
  );

CREATE POLICY "Managers can update family tasks"
  ON public.tasks FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM public.family_members WHERE manager_id = auth.uid()
    )
  );

CREATE POLICY "Managers can delete family tasks"
  ON public.tasks FOR DELETE
  USING (
    member_id IN (
      SELECT id FROM public.family_members WHERE manager_id = auth.uid()
    )
  );

-- PASSO 8: Criar trigger para updated_at
-- ===================================================================
DROP TRIGGER IF EXISTS on_family_member_updated ON public.family_members;
CREATE TRIGGER on_family_member_updated
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ===================================================================
-- MIGRAÇÃO CONCLUÍDA!
-- ===================================================================
-- Estrutura criada com sucesso.
-- Agora você pode:
-- 1. Criar membros da família pela interface
-- 2. Adicionar tarefas para cada membro
-- ===================================================================
