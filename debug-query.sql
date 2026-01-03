-- ===================================================================
-- QUERY DE DEBUG - Execute no Supabase para ver as tarefas
-- ===================================================================

-- 1. Ver todos os membros cadastrados
SELECT
  id,
  name,
  color,
  manager_id,
  created_at
FROM public.family_members
ORDER BY created_at DESC;

-- 2. Ver todas as tarefas (com member_id)
SELECT
  id,
  member_id,
  title,
  completed,
  priority,
  created_at
FROM public.tasks
ORDER BY created_at DESC;

-- 3. Ver tarefas com nome do membro
SELECT
  t.id,
  t.title,
  t.completed,
  t.priority,
  fm.name as member_name,
  t.created_at
FROM public.tasks t
LEFT JOIN public.family_members fm ON t.member_id = fm.id
ORDER BY t.created_at DESC;

-- 4. Contar tarefas por membro
SELECT
  fm.name as member_name,
  COUNT(t.id) as total_tasks
FROM public.family_members fm
LEFT JOIN public.tasks t ON t.member_id = fm.id
GROUP BY fm.id, fm.name
ORDER BY fm.name;

-- ===================================================================
-- Execute cada query separadamente para debug
-- ===================================================================
