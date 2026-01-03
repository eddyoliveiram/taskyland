import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMembers } from '@/hooks/useMembers'
import { useMemberStats } from '@/hooks/useMemberStats'
import { useMember } from '@/contexts/MemberContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, LogOut, User, Trophy, CheckCircle2, AlertCircle } from 'lucide-react'
import { MemberModal } from '@/components/members/MemberModal'
import { FamilyMember } from '@/types/family'

export function MemberSelection() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const { members, loading, addMember, updateMember, deleteMember } = useMembers()
  const { stats, topMemberId, loading: statsLoading } = useMemberStats()
  const { selectMember } = useMember()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>()
  const [manageMode, setManageMode] = useState(false)

  const handleSelectMember = (member: FamilyMember) => {
    selectMember(member)
    navigate('/')
  }

  const handleAddMember = () => {
    setEditingMember(undefined)
    setModalOpen(true)
  }

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setModalOpen(true)
  }

  const handleSignOut = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      selectMember(null)
      await signOut()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando membros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Avatar'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-primary-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gerenciador de Tarefas</h1>
                <p className="text-sm text-muted-foreground">
                  {profile?.full_name || profile?.email}
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
          <h2 className="text-xl font-semibold mb-2">
            Selecione um membro da família
          </h2>
          <p className="text-muted-foreground">
            Escolha para quem você deseja visualizar ou gerenciar tarefas
          </p>
        </motion.div>

        {/* Lista de Membros */}
        {members.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum membro cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Adicione membros da família para começar a organizar tarefas
            </p>
            <Button onClick={handleAddMember} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Primeiro Membro
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => !manageMode && handleSelectMember(member)}
                  >
                    <CardContent className="p-6">
                      {/* Troféu para o membro top */}
                      {topMemberId === member.id && !statsLoading && (
                        <div className="absolute top-2 left-2">
                          <div className="bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                            <Trophy className="w-5 h-5" />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-center text-center">
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl font-bold text-white">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{member.name}</h3>

                        {/* Estatísticas */}
                        {!statsLoading && stats[member.id] && (
                          <div className="w-full mt-2 space-y-2">
                            <div className="flex items-center justify-center gap-2 text-base">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="font-medium">
                                {stats[member.id].completed_tasks} tarefa{stats[member.id].completed_tasks !== 1 ? 's' : ''} concluída{stats[member.id].completed_tasks !== 1 ? 's' : ''}
                              </span>
                            </div>
                            {stats[member.id].pending_today > 0 && (
                              <div className="flex items-center justify-center gap-2 text-base text-blue-600">
                                <span className="font-medium">
                                  {stats[member.id].pending_today} pendente{stats[member.id].pending_today !== 1 ? 's' : ''} hoje
                                </span>
                              </div>
                            )}
                            {stats[member.id].overdue_tasks > 0 && (
                              <div className="flex items-center justify-center gap-2 text-base text-yellow-500">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">
                                  {stats[member.id].overdue_tasks} tarefa{stats[member.id].overdue_tasks !== 1 ? 's' : ''} atrasada{stats[member.id].overdue_tasks !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                            {stats[member.id].total_tasks > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(stats[member.id].completion_rate)}% das tarefas concluídas
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {manageMode && (
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditMember(member)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleAddMember}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar Membro
              </Button>
              <Button
                onClick={() => setManageMode(!manageMode)}
                variant={manageMode ? 'default' : 'outline'}
                size="lg"
                className="gap-2"
              >
                <Edit className="w-5 h-5" />
                {manageMode ? 'Concluir' : 'Gerenciar'}
              </Button>
            </div>
          </>
        )}

        {/* Modal de Adicionar/Editar Membro */}
        <MemberModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          member={editingMember}
          onSave={async (data) => {
            if (editingMember) {
              await updateMember(editingMember.id, data)
            } else {
              await addMember(data)
            }
            setModalOpen(false)
            setEditingMember(undefined)
          }}
          onDelete={
            editingMember
              ? async () => {
                  if (confirm(`Tem certeza que deseja remover ${editingMember.name}? Todas as tarefas serão perdidas!`)) {
                    await deleteMember(editingMember.id)
                    setModalOpen(false)
                    setEditingMember(undefined)
                  }
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}
