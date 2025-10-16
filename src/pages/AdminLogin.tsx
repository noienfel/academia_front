import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    try {
      const res = await fetch('http://localhost:3000/admins/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.erro || 'Erro ao logar')
        return
      }

      // Salva dados no localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('nome', data.nome)
      localStorage.setItem('tipoUsuario', 'admin')
      localStorage.setItem('userId', data.id)
      localStorage.setItem('nivel', data.nivel?.toString() || '1')

      navigate('/dashboard') 
    } catch (error) {
      setErro('Erro de conexão com o servidor')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Área Administrativa</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Login para instrutores e administradores</p>
        </div>

        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Entrar como Admin
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Área do aluno?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Login Aluno
            </Link>
          </p>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            <p>Conta de teste:</p>
            <p><strong>Admin:</strong> admin@email.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  )
}