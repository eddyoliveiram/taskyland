import { useState, useCallback, useMemo, useEffect } from 'react'
import { Task, Priority, TaskStatistics, SortType, FilterType } from '@/types'
import { startOfDay, startOfWeek, startOfMonth, differenceInMinutes } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useTasksDb() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('date')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Carregar tarefas do banco
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const mappedTasks: Task[] = (data || []).map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        completed: task.completed,
        priority: task.priority as Priority,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
        createdAt: new Date(task.created_at),
        category: task.category || undefined,
        tags: task.tags || undefined,
      }))

      setTasks(mappedTasks)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // Subscrever a mudanças em tempo real
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, loadTasks])

  const addTask = useCallback(
    async (
      title: string,
      description?: string,
      priority: Priority = 'medium',
      dueDate?: Date,
      category?: string,
      tags?: string[]
    ) => {
      if (!user) return

      try {
        const { error } = await supabase.from('tasks').insert({
          user_id: user.id,
          title,
          description: description || null,
          priority,
          due_date: dueDate?.toISOString() || null,
          category: category || null,
          tags: tags || null,
        } as any)

        if (error) throw error
        await loadTasks()
      } catch (error) {
        console.error('Erro ao adicionar tarefa:', error)
        throw error
      }
    },
    [user, loadTasks]
  )

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      if (!user) return

      try {
        const updateData = {
          title: updates.title,
          description: updates.description || null,
          priority: updates.priority,
          due_date: updates.dueDate?.toISOString() || null,
          category: updates.category || null,
          tags: updates.tags || null,
          completed: updates.completed,
          completed_at: updates.completedAt?.toISOString() || null,
        }

        // @ts-ignore - Supabase Database types compatibility
        const { error } = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.id)

        if (error) throw error
        await loadTasks()
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error)
        throw error
      }
    },
    [user, loadTasks]
  )

  const toggleTask = useCallback(
    async (id: string) => {
      if (!user) return

      const task = tasks.find((t) => t.id === id)
      if (!task) return

      const completed = !task.completed

      try {
        const toggleData = {
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        }

        // @ts-ignore - Supabase Database types compatibility
        const { error } = await supabase
          .from('tasks')
          .update(toggleData)
          .eq('id', id)
          .eq('user_id', user.id)

        if (error) throw error
        await loadTasks()
      } catch (error) {
        console.error('Erro ao alternar tarefa:', error)
        throw error
      }
    },
    [user, tasks, loadTasks]
  )

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) return

      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (error) throw error
        await loadTasks()
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error)
        throw error
      }
    },
    [user, loadTasks]
  )

  const clearCompleted = useCallback(async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', user.id)
        .eq('completed', true)

      if (error) throw error
      await loadTasks()
    } catch (error) {
      console.error('Erro ao limpar tarefas concluídas:', error)
      throw error
    }
  }, [user, loadTasks])

  const filteredTasks = useMemo(() => {
    let result = tasks

    if (filter !== 'all') {
      result = result.filter((task) =>
        filter === 'completed' ? task.completed : !task.completed
      )
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.category?.toLowerCase().includes(query) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        case 'title':
          return a.title.localeCompare(b.title)
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return result
  }, [tasks, filter, sortBy, searchQuery])

  const statistics = useMemo((): TaskStatistics => {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const monthStart = startOfMonth(now)

    const completed = tasks.filter((t) => t.completed)
    const pending = tasks.filter((t) => !t.completed)

    const completedToday = completed.filter(
      (t) => t.completedAt && new Date(t.completedAt) >= todayStart
    ).length

    const completedThisWeek = completed.filter(
      (t) => t.completedAt && new Date(t.completedAt) >= weekStart
    ).length

    const completedThisMonth = completed.filter(
      (t) => t.completedAt && new Date(t.completedAt) >= monthStart
    ).length

    const byPriority = {
      low: tasks.filter((t) => t.priority === 'low' && !t.completed).length,
      medium: tasks.filter((t) => t.priority === 'medium' && !t.completed).length,
      high: tasks.filter((t) => t.priority === 'high' && !t.completed).length,
    }

    const byCategory: Record<string, number> = {}
    tasks.forEach((task) => {
      if (task.category) {
        byCategory[task.category] = (byCategory[task.category] || 0) + 1
      }
    })

    const completionTimes = completed
      .filter((t) => t.completedAt)
      .map((t) =>
        differenceInMinutes(new Date(t.completedAt!), new Date(t.createdAt))
      )

    const averageCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : undefined

    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      completedToday,
      completedThisWeek,
      completedThisMonth,
      completionRate: tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0,
      averageCompletionTime,
      byPriority,
      byCategory,
    }
  }, [tasks])

  return {
    tasks: filteredTasks,
    allTasks: tasks,
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
    clearCompleted,
    statistics,
    loading,
  }
}
