import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '@/types'
import { TaskItem } from './TaskItem'
import { Button } from '@/components/ui/button'
import { Inbox, ChevronLeft, ChevronRight } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

const ITEMS_PER_PAGE = 5

export function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Reset para página 1 quando a lista de tarefas mudar
  useEffect(() => {
    setCurrentPage(1)
  }, [tasks.length])

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTasks = tasks.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <Inbox className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nenhuma tarefa encontrada</h3>
        <p className="text-muted-foreground text-center">
          Adicione uma nova tarefa para começar a organizar seu dia!
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="space-y-3">
        <AnimatePresence>
          {currentTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handlePageClick(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-muted-foreground">
                    ...
                  </span>
                )
              }
              return null
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <p className="text-center text-sm text-muted-foreground pb-2">
          Página {currentPage} de {totalPages} ({tasks.length} tarefas no total)
        </p>
      )}
    </div>
  )
}
