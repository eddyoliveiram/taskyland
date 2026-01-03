import { Navigate } from 'react-router-dom'
import { useMember } from '@/contexts/MemberContext'

interface MemberRouteProps {
  children: React.ReactNode
}

export function MemberRoute({ children }: MemberRouteProps) {
  const { selectedMember } = useMember()

  if (!selectedMember) {
    return <Navigate to="/members" replace />
  }

  return <>{children}</>
}
