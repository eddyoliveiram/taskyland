import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { startOfDay, endOfDay, isPast } from 'date-fns'

export interface MemberStats {
  member_id: string
  total_tasks: number
  completed_tasks: number
  pending_tasks: number
  pending_today: number
  overdue_tasks: number
  completion_rate: number
}

export function useMemberStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Record<string, MemberStats>>({})
  const [topMemberId, setTopMemberId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStats = useCallback(async () => {
    if (!user) {
      setStats({})
      setTopMemberId(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Buscar todos os membros do gerente
      // @ts-ignore
      const { data: members, error: membersError } = await supabase
        .from('family_members')
        .select('id')
        .eq('manager_id', user.id)

      if (membersError) throw membersError

      if (!members || members.length === 0) {
        setStats({})
        setTopMemberId(null)
        setLoading(false)
        return
      }

      const memberIds = members.map(m => m.id)

      // Buscar estatísticas de cada membro
      // @ts-ignore
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('member_id, completed, due_date')
        .in('member_id', memberIds)

      if (tasksError) throw tasksError

      // Calcular estatísticas por membro
      const statsMap: Record<string, MemberStats> = {}
      const today = new Date()
      const todayStart = startOfDay(today)
      const todayEnd = endOfDay(today)

      memberIds.forEach(memberId => {
        const memberTasks = (tasks || []).filter(t => t.member_id === memberId)
        const completed = memberTasks.filter(t => t.completed).length
        const total = memberTasks.length

        // Tarefas pendentes de hoje (não concluídas com vencimento hoje)
        const pendingToday = memberTasks.filter(t => {
          if (t.completed || !t.due_date) return false
          const dueDate = new Date(t.due_date)
          return dueDate >= todayStart && dueDate <= todayEnd
        }).length

        // Tarefas atrasadas (não concluídas com vencimento no passado)
        const overdue = memberTasks.filter(t => {
          if (t.completed || !t.due_date) return false
          const dueDate = new Date(t.due_date)
          return isPast(dueDate) && dueDate < todayStart
        }).length

        statsMap[memberId] = {
          member_id: memberId,
          total_tasks: total,
          completed_tasks: completed,
          pending_tasks: total - completed,
          pending_today: pendingToday,
          overdue_tasks: overdue,
          completion_rate: total > 0 ? (completed / total) * 100 : 0,
        }
      })

      setStats(statsMap)

      // Encontrar o membro com mais tarefas concluídas
      let topId: string | null = null
      let maxCompleted = 0

      Object.values(statsMap).forEach(stat => {
        if (stat.completed_tasks > maxCompleted) {
          maxCompleted = stat.completed_tasks
          topId = stat.member_id
        }
      })

      setTopMemberId(maxCompleted > 0 ? topId : null)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
      setStats({})
      setTopMemberId(null)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return {
    stats,
    topMemberId,
    loading,
    reload: loadStats,
  }
}
