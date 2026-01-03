export interface FamilyMember {
  id: string
  manager_id: string
  name: string
  avatar_url: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface FamilyMemberInput {
  name: string
  avatar_url?: string | null
  color?: string
}

export const MEMBER_COLORS = [
  '#3b82f6', // Azul
  '#ef4444', // Vermelho
  '#10b981', // Verde
  '#f59e0b', // Amarelo/Laranja
  '#8b5cf6', // Roxo
  '#ec4899', // Rosa
  '#06b6d4', // Ciano
  '#f97316', // Laranja
  '#14b8a6', // Teal
  '#a855f7', // Violeta
] as const

export type MemberColor = typeof MEMBER_COLORS[number]
