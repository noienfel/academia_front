import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Alunos from './pages/Alunos'
import Treinos from './pages/Treinos'
import Exercicios from './pages/Exercicios'
import Planos from './pages/Planos'

// Componente para rotas privadas
function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/alunos" element={<PrivateRoute><Alunos /></PrivateRoute>} />
          <Route path="/treinos" element={<PrivateRoute><Treinos /></PrivateRoute>} />
          <Route path="/exercicios" element={<PrivateRoute><Exercicios /></PrivateRoute>} />
          <Route path="/planos" element={<PrivateRoute><Planos /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  )
}
