import { useState } from 'react'
import { Task, Priority } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  onSubmit: (
    title: string,
    description?: string,
    priority?: Priority,
    dueDate?: Date,
    category?: string,
    tags?: string[]
  ) => void
}

export function TaskModal({ open, onOpenChange, task, onSubmit }: TaskModalProps) {
  // Helper para obter data de hoje no formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium')
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : getTodayDate()
  )
  const [category, setCategory] = useState(task?.category || '')
  const [tagsInput, setTagsInput] = useState(task?.tags?.join(', ') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    // Corrigir problema de timezone: adicionar horário para evitar deslocamento de 1 dia
    const parsedDueDate = dueDate ? new Date(dueDate + 'T12:00:00') : undefined

    onSubmit(
      title,
      description || undefined,
      priority,
      parsedDueDate,
      category || undefined,
      tags.length > 0 ? tags : undefined
    )

    if (!task) {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate(getTodayDate())
      setCategory('')
      setTagsInput('')
    }

    onOpenChange(false)
  }

  const handleClose = () => {
    if (!task) {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate(getTodayDate())
      setCategory('')
      setTagsInput('')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
          <DialogClose onClick={handleClose} />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Título *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa..."
              autoFocus
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes sobre a tarefa..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Prioridade
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all border-2",
                      priority === p
                        ? p === 'low'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300'
                          : p === 'medium'
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-300'
                          : 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    {p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Data de Vencimento
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onClick={(e) => {
                  // Garantir que o calendário abra ao clicar
                  const input = e.target as HTMLInputElement
                  input.showPicker?.()
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Categoria
              </label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Trabalho, Pessoal..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Tags
              </label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: urgente, importante..."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 gap-2">
              {task ? (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Adicionar Tarefa
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
