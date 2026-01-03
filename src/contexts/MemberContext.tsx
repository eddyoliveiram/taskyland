import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { FamilyMember } from '@/types/family'

interface MemberContextType {
  selectedMember: FamilyMember | null
  selectMember: (member: FamilyMember | null) => void
}

const MemberContext = createContext<MemberContextType | undefined>(undefined)

export function MemberProvider({ children }: { children: ReactNode }) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(() => {
    // Tentar recuperar do localStorage
    const saved = localStorage.getItem('selectedMember')
    return saved ? JSON.parse(saved) : null
  })

  const selectMember = (member: FamilyMember | null) => {
    setSelectedMember(member)
    if (member) {
      localStorage.setItem('selectedMember', JSON.stringify(member))
    } else {
      localStorage.removeItem('selectedMember')
    }
  }

  // Limpar membro selecionado ao desmontar
  useEffect(() => {
    return () => {
      // Não limpar ao desmontar, manter a seleção
    }
  }, [])

  return (
    <MemberContext.Provider value={{ selectedMember, selectMember }}>
      {children}
    </MemberContext.Provider>
  )
}

export function useMember() {
  const context = useContext(MemberContext)
  if (context === undefined) {
    throw new Error('useMember must be used within a MemberProvider')
  }
  return context
}
