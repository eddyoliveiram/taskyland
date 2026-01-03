-- ===================================================================
-- SCRIPT DE LIMPEZA - Execute ANTES da migração
-- ===================================================================
-- Este script remove todas as políticas e estruturas antigas
-- para permitir uma migração limpa
-- ===================================================================

-- 1. Remover todas as políticas da tabela tasks
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Managers can view family tasks" ON public.tasks;
DROP POLICY IF EXISTS "Managers can create family tasks" ON public.tasks;
DROP POLICY IF EXISTS "Managers can update family tasks" ON public.tasks;
DROP POLICY IF EXISTS "Managers can delete family tasks" ON public.tasks;

-- 2. Remover todas as políticas da tabela family_members (se existir)
DROP POLICY IF EXISTS "Managers can view own family members" ON public.family_members;
DROP POLICY IF EXISTS "Managers can create family members" ON public.family_members;
DROP POLICY IF EXISTS "Managers can update own family members" ON public.family_members;
DROP POLICY IF EXISTS "Managers can delete own family members" ON public.family_members;

-- 3. Remover trigger da tabela family_members (se existir)
DROP TRIGGER IF EXISTS on_family_member_updated ON public.family_members;

-- 4. Remover tabela family_members se existir (CUIDADO: apaga dados!)
DROP TABLE IF EXISTS public.family_members CASCADE;

-- ===================================================================
-- Agora execute o script database-migration-family.sql
-- ===================================================================
