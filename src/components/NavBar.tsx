import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const nomeUsuario = localStorage.getItem('nome') // nome salvo no login

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('nome')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-lg font-extrabold text-blue-600">Academia</div>
        <div className="flex items-center space-x-6">
          {token ? (
            <>
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
              <Link to="/alunos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Alunos</Link>
              <Link to="/planos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Planos</Link>
              <Link to="/treinos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Treinos</Link>
              <Link to="/exercicios" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Exercícios</Link>
              
              <span className="font-semibold text-gray-800">{nomeUsuario}</span>
              
              <button 
                onClick={logout} 
                className="ml-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
