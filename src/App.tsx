import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { MemberProvider } from '@/contexts/MemberContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MemberRoute } from '@/components/auth/MemberRoute'
import { Header } from '@/components/layout/Header'
import { Navigation } from '@/components/layout/Navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Login } from '@/pages/Login'
import { MemberSelection } from '@/pages/MemberSelection'
import { Home } from '@/pages/Home'
import { Dashboard } from '@/pages/Dashboard'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <AuthProvider>
        <MemberProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Rota de seleção de membro (após login) */}
            <Route
              path="/members"
              element={
                <ProtectedRoute>
                  <MemberSelection />
                </ProtectedRoute>
              }
            />

            {/* Rotas que requerem membro selecionado */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MemberRoute>
                    <div className="min-h-screen bg-background">
                      <Header onMenuClick={() => setSidebarOpen(true)} />
                      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                      <main className="min-h-[calc(100vh-4rem)]">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                      </main>

                      <Navigation />
                    </div>
                  </MemberRoute>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemberProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
