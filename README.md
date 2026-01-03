# To-Do List - Gerenciador de Tarefas

Aplicativo web moderno de gerenciamento de tarefas com interface responsiva, otimizado para mobile e com sincronização na nuvem.

## Características

- **Autenticação com Google**: Login seguro usando Google OAuth
- **Banco de Dados na Nuvem**: Dados sincronizados com Supabase PostgreSQL
- **Multi-usuário**: Cada usuário tem seus próprios dados isolados
- **Interface Moderna**: Design clean e intuitivo com componentes shadcn/ui
- **Dashboard Completo**: Visualização avançada de progresso com gráficos interativos
- **Modo Escuro**: Sistema de temas (claro/escuro/sistema)
- **Responsivo**: Otimizado para desktop, tablet e mobile
- **Estatísticas Avançadas**: Acompanhe sua produtividade com múltiplas métricas
- **Sistema de Streaks**: Acompanhe sequências de dias produtivos
- **Mapa de Calor**: Visualize 365 dias de atividade em formato de calendário
- **Prioridades**: Organize tarefas por prioridade (baixa/média/alta)
- **Categorias e Tags**: Organize suas tarefas com categorias e tags personalizadas
- **Filtros e Busca**: Encontre rapidamente suas tarefas
- **Animações**: Transições suaves com Framer Motion
- **Sincronização em Tempo Real**: Dados atualizados automaticamente
- **Segurança**: Row Level Security (RLS) garante isolamento de dados

## Stack Tecnológica

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Framer Motion** - Animações
- **React Router** - Navegação
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones

### Backend & Autenticação
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados
- **Supabase Auth** - Autenticação
- **Google OAuth** - Login social
- **Row Level Security (RLS)** - Segurança de dados

## Instalação e Configuração

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd to-do-list
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Configurar Supabase
Siga o guia completo em [SETUP-SUPABASE.md](./SETUP-SUPABASE.md) para:
- Configurar Google OAuth
- Criar tabelas no banco de dados
- Configurar políticas de segurança (RLS)

### 5. Rodar o Projeto
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Funcionalidades

### Gerenciamento de Tarefas
- Criar, editar e excluir tarefas
- Marcar tarefas como concluídas
- Adicionar descrições detalhadas
- Definir prioridades (baixa/média/alta)
- Adicionar datas de vencimento
- Organizar por categorias
- Adicionar tags personalizadas

### Filtros e Organização
- Filtrar por status (todas/pendentes/concluídas)
- Ordenar por data, prioridade ou título
- Busca em tempo real
- Limpar tarefas concluídas

### Dashboard e Estatísticas
- **Visão Geral**: Cards com métricas principais
- **Sistema de Streaks**: Acompanhe dias consecutivos de produtividade
- **Gráfico de Atividade**: Últimos 7 dias com tarefas criadas e concluídas
- **Mapa de Calor**: 30 dias de histórico em formato visual
- **Comparação Semanal**: Progresso das últimas 4 semanas
- **Insights de Produtividade**:
  - Dia da semana mais produtivo
  - Horário de pico de produtividade
  - Média diária de tarefas
  - Tendências de conclusão
- **Gráficos por Prioridade**: Visualize distribuição de tarefas
- **Análise por Categoria**: Organize por contexto
- **Mensagens Motivacionais**: Feedback personalizado baseado no progresso

### Configurações
- Alternar entre temas (claro/escuro/sistema)
- Exportar dados em JSON
- Importar backup
- Limpar todos os dados

## Estrutura do Projeto

```
src/
├── components/
│   ├── dashboard/       # Componentes do dashboard (gráficos, streaks, insights)
│   ├── layout/          # Header, Navigation, Sidebar
│   ├── stats/           # Componentes de estatísticas
│   ├── tasks/           # Componentes de tarefas
│   └── ui/              # Componentes UI base (shadcn)
├── hooks/               # Custom hooks (useTasks, useProductivity, useTheme)
├── lib/                 # Utilitários
├── pages/               # Páginas (Home, Dashboard, Stats, Settings)
├── styles/              # Estilos globais
└── types/               # Definições TypeScript
```

## Deploy

### Vercel (Recomendado)
1. Faça push do código para o GitHub
2. Acesse [Vercel](https://vercel.com) e importe o repositório
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

Veja mais detalhes no [SETUP-SUPABASE.md](./SETUP-SUPABASE.md)

## Arquitetura

### Autenticação
- Login via Google OAuth
- Sessão persistente com Supabase Auth
- Proteção de rotas com `ProtectedRoute`

### Banco de Dados
- **profiles**: Informações dos usuários
- **tasks**: Tarefas de cada usuário
- **RLS Policies**: Cada usuário só vê suas próprias tarefas

### Sincronização
- Real-time subscriptions do Supabase
- Atualizações automáticas quando dados mudam
- Optimistic updates para melhor UX

## Próximos Passos

- [ ] Notificações push para tarefas vencendo
- [ ] Compartilhamento de tarefas entre usuários
- [ ] Modo offline com sync posterior
- [ ] Anexos em tarefas
- [ ] Temas customizáveis
- [ ] App mobile nativo

## Licença

MIT
