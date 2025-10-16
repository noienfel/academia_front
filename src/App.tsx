import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import Alunos from './pages/Alunos'
import Treinos from './pages/Treinos'
import Exercicios from './pages/Exercicios'
import Planos from './pages/Planos'
import MeusTreinos from './pages/MeusTreinos'
import Pagamentos from './pages/Pagamentos'
import PlanosPublicos from './pages/PlanosPublicos'
import Cadastro from './pages/Cadastro'

// Componente para rotas privadas
function PrivateRoute({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) {
  const token = localStorage.getItem('token')
  const tipoUsuario = localStorage.getItem('tipoUsuario')
  
  if (!token) return <Navigate to="/" replace />
  
  if (allowedRoles && !allowedRoles.includes(tipoUsuario || '')) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Limpa qualquer login anterior na primeira carga
    if (window.location.pathname === '/') {
      localStorage.clear()
    }
    setToken(localStorage.getItem('token'))
  }, [])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <NavBar />
        <main className="container mx-auto p-4">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<PlanosPublicos />} />
          <Route path="/planos-publicos" element={<PlanosPublicos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Rotas Privadas */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Dashboard />
            </PrivateRoute>
          } />
          
          {/* Rotas para Admin */}
          <Route path="/alunos" element={<PrivateRoute allowedRoles={['admin']}><Alunos /></PrivateRoute>} />
          <Route path="/treinos" element={<PrivateRoute allowedRoles={['admin']}><Treinos /></PrivateRoute>} />
          <Route path="/exercicios" element={<PrivateRoute allowedRoles={['admin']}><Exercicios /></PrivateRoute>} />
          
          {/* Rotas para Aluno */}
          <Route path="/meus-treinos" element={<PrivateRoute allowedRoles={['aluno']}><MeusTreinos /></PrivateRoute>} />
          <Route path="/pagamentos" element={<PrivateRoute allowedRoles={['aluno']}><Pagamentos /></PrivateRoute>} />
          
          {/* Rota compartilhada de planos */}
          <Route path="/planos" element={<PrivateRoute><Planos /></PrivateRoute>} />
        </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}
