import { NavLink } from 'react-router-dom'
import { Home, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationProps {
  isMobile?: boolean
  onNavigate?: () => void
}

const links = [
  { to: '/', label: 'Tarefas', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export function Navigation({ isMobile = false, onNavigate }: NavigationProps) {
  return (
    <nav className={cn(
      isMobile
        ? 'flex flex-col gap-2 p-4'
        : 'fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    )}>
      {isMobile ? (
        links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          )
        })
      ) : (
        <div className="container flex items-center justify-around h-16 px-2 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[4rem] flex-shrink-0',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('w-6 h-6', isActive && 'scale-110')} />
                    <span className="text-xs font-medium whitespace-nowrap">{link.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      )}
    </nav>
  )
}
