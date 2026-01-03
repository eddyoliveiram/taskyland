import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTasksDb } from '@/hooks/useTasksDb'
import { useAuth } from '@/contexts/AuthContext'
import { useMember } from '@/contexts/MemberContext'
import { Task } from '@/types'
import { TaskModal } from '@/components/tasks/TaskModal'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { Button } from '@/components/ui/button'
import { Plus, LogOut, ArrowLeft } from 'lucide-react'
import { getGreeting } from '@/lib/utils'

export function Home() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { selectedMember, selectMember } = useMember()
  const {
    tasks,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    statistics,
    loading,
  } = useTasksDb()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const handleSignOut = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      selectMember(null)
      await signOut()
    }
  }

  const handleBackToMembers = () => {
    navigate('/members')
  }

  const handleSubmit = (
    title: string,
    description?: string,
    priority?: Task['priority'],
    dueDate?: Date,
    category?: string,
    tags?: string[]
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        description,
        priority,
        dueDate,
        category,
        tags,
      })
      setEditingTask(undefined)
    } else {
      addTask(title, description, priority, dueDate, category, tags)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingTask(undefined)
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Header com Membro Selecionado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToMembers}
              title="Voltar para seleção de membros"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: selectedMember?.color || '#3b82f6' }}
            >
              {selectedMember?.avatar_url ? (
                <img
                  src={selectedMember.avatar_url}
                  alt={selectedMember.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {selectedMember?.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{getGreeting()}!</h2>
              <p className="text-sm text-muted-foreground">
                Tarefas de {selectedMember?.name}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSignOut}
            title="Sair da conta"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-muted-foreground">
          Você tem {statistics.pending} tarefa{statistics.pending !== 1 ? 's' : ''} pendente
          {statistics.pending !== 1 ? 's' : ''}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={() => setModalOpen(true)}
          className="w-full mb-6 gap-2 h-12 text-base"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Nova Tarefa
        </Button>
      </motion.div>

      <TaskModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        task={editingTask}
        onSubmit={handleSubmit}
      />

      <TaskFilters
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={handleEdit}
      />
    </div>
  )
}
