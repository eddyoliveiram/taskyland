-- ===================================================================
-- CORREÇÃO: Tornar coluna user_id opcional
-- ===================================================================
-- A coluna user_id está como NOT NULL, mas agora usamos member_id
-- Este script torna user_id opcional (nullable)
-- ===================================================================

-- 1. Tornar coluna user_id opcional (permite NULL)
ALTER TABLE public.tasks ALTER COLUMN user_id DROP NOT NULL;

-- 2. Verificar se funcionou
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'tasks'
AND column_name IN ('user_id', 'member_id');

-- ===================================================================
-- Agora você pode inserir tarefas apenas com member_id!
-- ===================================================================
