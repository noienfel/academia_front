import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const nome = localStorage.getItem('nome')
  const tipoUsuario = localStorage.getItem('tipoUsuario')

  function handleLogout() {
    localStorage.clear()
    navigate('/planos-publicos')
  }

  if (!token) return null

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-xl font-bold"
            >
              Academia System
            </Link>
            <div className="hidden md:flex space-x-4">
              {/* Admin - Acesso total */}
              {tipoUsuario === 'admin' && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard') ? 'bg-blue-700' : 'hover:bg-blue-500'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/alunos" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/alunos') ? 'bg-blue-700' : 'hover:bg-blue-500'
                    }`}
                  >
                    Alunos
                  </Link>
                  <Link 
                    to="/treinos" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/treinos') ? 'bg-blue-700' : 'hover:bg-blue-500'
                    }`}
                  >
                    Treinos
                  </Link>
                  <Link 
                    to="/exercicios" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/exercicios') ? 'bg-blue-700' : 'hover:bg-blue-500'
                    }`}
                  >
                    Exercícios
                  </Link>
                  <Link 
                    to="/planos" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/planos') ? 'bg-blue-700' : 'hover:bg-blue-500'
                    }`}
                  >
                    Financeiro
                  </Link>
                </>
              )}

              {/* Aluno - Vê treinos e planos */}
              {tipoUsuario === 'aluno' && (
                <>
                  <Link 
                    to="/meus-treinos" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/meus-treinos') ? 'bg-blue-700' : 'hover:bg-blue-500'
                    }`}
                  >
                    Meus Treinos
                  </Link>
                  <Link 
                    to="/planos" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/planos') ? 'bg-blue-700' : 'hover:bg-blue-500'
                    }`}
                  >
                    Planos
                  </Link>
                  <Link 
                    to="/pagamentos" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/pagamentos') ? 'bg-blue-700' : 'hover:bg-blue-500'
                    }`}
                  >
                    Pagamentos
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {nome && (
              <div className="text-sm">
                <span className="font-semibold">{nome}</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  tipoUsuario === 'admin' ? 'bg-green-700' : 'bg-blue-700'
                }`}>
                  {tipoUsuario === 'admin' ? 'Admin/Instrutor' : 'Aluno'}
                </span>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}