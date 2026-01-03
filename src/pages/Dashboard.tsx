import { motion } from 'framer-motion'
import { useTasksDb } from '@/hooks/useTasksDb'
import { useProductivity } from '@/hooks/useProductivity'
import { HeatMap } from '@/components/dashboard/HeatMap'
import { StreakCard } from '@/components/dashboard/StreakCard'
import { StatsCard } from '@/components/stats/StatsCard'
import { ProgressChart } from '@/components/stats/ProgressChart'
import { BarChart3, CheckCircle2, Clock, Zap } from 'lucide-react'

export function Dashboard() {
  const { allTasks, statistics, loading } = useTasksDb()
  const { dailyStats, productivityMetrics } = useProductivity(allTasks)

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Análise completa da sua produtividade e progresso
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total de Tarefas"
          value={statistics.total}
          icon={BarChart3}
          description="Tarefas criadas"
          delay={0}
        />
        <StatsCard
          title="Taxa de Conclusão"
          value={`${statistics.completionRate.toFixed(0)}%`}
          icon={CheckCircle2}
          description={`${statistics.completed} concluídas`}
          delay={0.05}
        />
        <StatsCard
          title="Pendentes"
          value={statistics.pending}
          icon={Clock}
          description="Aguardando conclusão"
          delay={0.1}
        />
        <StatsCard
          title="Hoje"
          value={statistics.completedToday}
          icon={Zap}
          description="Concluídas hoje"
          delay={0.15}
        />
      </div>

      {/* Streak and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <StreakCard metrics={productivityMetrics} />
        </div>
        <div className="lg:col-span-2">
          <ProgressChart statistics={statistics} />
        </div>
      </div>

      {/* Heat Map */}
      <div className="mb-6">
        <HeatMap data={dailyStats} />
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-6 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">
            {getMotivationalEmoji(productivityMetrics.currentStreak, statistics.completionRate)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">
              {getMotivationalTitle(productivityMetrics.currentStreak, statistics.completionRate)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getMotivationalMessage(productivityMetrics.currentStreak, statistics.completionRate, statistics.pending)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function getMotivationalEmoji(streak: number, completionRate: number): string {
  if (streak >= 7 && completionRate >= 80) return '🏆'
  if (streak >= 3) return '🔥'
  if (completionRate >= 70) return '⭐'
  if (completionRate >= 50) return '💪'
  return '🎯'
}

function getMotivationalTitle(streak: number, completionRate: number): string {
  if (streak >= 7 && completionRate >= 80) return 'Você é um campeão!'
  if (streak >= 5) return 'Sequência incrível!'
  if (streak >= 3) return 'Continue assim!'
  if (completionRate >= 80) return 'Excelente desempenho!'
  if (completionRate >= 60) return 'Bom trabalho!'
  if (completionRate >= 40) return 'Você está progredindo!'
  return 'Comece sua jornada!'
}

function getMotivationalMessage(streak: number, completionRate: number, pending: number): string {
  if (streak >= 7 && completionRate >= 80) {
    return 'Sua dedicação é admirável! Você está mantendo uma sequência de 7+ dias com alta taxa de conclusão. Continue focado!'
  }
  if (streak >= 5) {
    return `${streak} dias seguidos completando tarefas! Você está construindo um hábito sólido de produtividade.`
  }
  if (streak >= 3) {
    return `${streak} dias de sequência! Mais alguns dias e você terá uma semana completa.`
  }
  if (completionRate >= 80) {
    return 'Sua taxa de conclusão está excelente! Você está gerenciando suas tarefas de forma muito eficiente.'
  }
  if (completionRate >= 60) {
    return 'Bom progresso! Continue trabalhando nas suas tarefas pendentes para melhorar ainda mais.'
  }
  if (pending > 10) {
    return `Você tem ${pending} tarefas pendentes. Que tal focar em completar algumas hoje?`
  }
  if (pending > 0) {
    return `${pending} tarefa${pending > 1 ? 's' : ''} esperando por você. Vamos começar?`
  }
  return 'Crie suas primeiras tarefas e comece a acompanhar seu progresso!'
}
