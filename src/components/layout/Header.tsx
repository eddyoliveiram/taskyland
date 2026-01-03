import { Sun, Moon, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
  onMenuClick?: () => void
  showLogout?: boolean
  onLogout?: () => void
}

export function Header({ onMenuClick, showLogout, onLogout }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />
    return <Moon className="w-5 h-5" />
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <img
              src="/taskyland-logo.png"
              alt="TaskyLand"
              className="h-16 w-auto"
            />
            <h1 className="text-2xl font-bold text-foreground">
              TaskyLand
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro'}
          >
            {getThemeIcon()}
          </Button>
          {showLogout && onLogout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              title="Sair da conta"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
