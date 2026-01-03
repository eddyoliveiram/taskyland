import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { FamilyMember, FamilyMemberInput } from '@/types/family'
import { useAuth } from '@/contexts/AuthContext'

export function useMembers() {
  const { user } = useAuth()
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)

  const loadMembers = useCallback(async () => {
    if (!user) {
      setMembers([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // @ts-ignore
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('manager_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error('Erro ao carregar membros:', error)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  const addMember = useCallback(async (input: FamilyMemberInput) => {
    if (!user) return

    try {
      // @ts-ignore
      const { data, error } = await supabase
        .from('family_members')
        .insert({
          manager_id: user.id,
          name: input.name,
          avatar_url: input.avatar_url || null,
          color: input.color || '#3b82f6',
        } as any)
        .select()
        .single()

      if (error) throw error
      await loadMembers()
      return data
    } catch (error) {
      console.error('Erro ao adicionar membro:', error)
      throw error
    }
  }, [user, loadMembers])

  const updateMember = useCallback(async (id: string, input: Partial<FamilyMemberInput>) => {
    try {
      // @ts-ignore
      const { error } = await supabase
        .from('family_members')
        .update(input as any)
        .eq('id', id)

      if (error) throw error
      await loadMembers()
    } catch (error) {
      console.error('Erro ao atualizar membro:', error)
      throw error
    }
  }, [loadMembers])

  const deleteMember = useCallback(async (id: string) => {
    try {
      // @ts-ignore
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadMembers()
    } catch (error) {
      console.error('Erro ao deletar membro:', error)
      throw error
    }
  }, [loadMembers])

  return {
    members,
    loading,
    addMember,
    updateMember,
    deleteMember,
    reload: loadMembers,
  }
}
