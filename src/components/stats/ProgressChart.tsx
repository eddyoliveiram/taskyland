import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TaskStatistics } from '@/types'

interface ProgressChartProps {
  statistics: TaskStatistics
}

export function ProgressChart({ statistics }: ProgressChartProps) {
  const items = [
    {
      label: 'Alta Prioridade',
      value: statistics.byPriority.high,
      total: statistics.total,
      color: 'bg-red-500',
    },
    {
      label: 'Média Prioridade',
      value: statistics.byPriority.medium,
      total: statistics.total,
      color: 'bg-yellow-500',
    },
    {
      label: 'Baixa Prioridade',
      value: statistics.byPriority.low,
      total: statistics.total,
      color: 'bg-blue-500',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Tarefas por Prioridade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">
                  {item.value} de {item.total}
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`
                  }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className={`h-full ${item.color}`}
                />
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className="text-sm font-bold text-primary">
                {statistics.completionRate.toFixed(0)}%
              </span>
            </div>
            <Progress value={statistics.completionRate} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
