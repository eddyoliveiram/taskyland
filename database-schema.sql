-- Habilitar extensão UUID
create extension if not exists "uuid-ossp";

-- Criar tabela de perfis (profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de tarefas (tasks)
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  completed boolean default false not null,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium' not null,
  due_date timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  category text,
  tags text[]
);

-- Criar índices para melhorar performance
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_due_date_idx on public.tasks(due_date);
create index if not exists tasks_completed_idx on public.tasks(completed);
create index if not exists tasks_created_at_idx on public.tasks(created_at);

-- Habilitar Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

-- Políticas de segurança para profiles
-- Usuários podem ver apenas seu próprio perfil
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Políticas de segurança para tasks
-- Usuários podem ver apenas suas próprias tarefas
create policy "Users can view own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

-- Usuários podem criar tarefas
create policy "Users can create own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

-- Usuários podem atualizar apenas suas próprias tarefas
create policy "Users can update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

-- Usuários podem deletar apenas suas próprias tarefas
create policy "Users can delete own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Função para criar perfil automaticamente após signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger para criar perfil após signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Função para atualizar updated_at automaticamente
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger para atualizar updated_at em profiles
drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Trigger para atualizar updated_at em tasks
drop trigger if exists on_task_updated on public.tasks;
create trigger on_task_updated
  before update on public.tasks
  for each row execute procedure public.handle_updated_at();
